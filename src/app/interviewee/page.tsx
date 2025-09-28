'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useDispatch } from 'react-redux';
import { addCandidate } from '@/store/slices/candidateSlice';
interface ScoreResult {
  question: string;
  answer: string;
  score: number;
}

interface ScoreData {
  results: ScoreResult[];
  summary: string;
}

interface Question {
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface CandidateInfo {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
}

const IntervieweeTab: React.FC = () => {
  const dispatch = useDispatch();

  const [file, setFile] = useState<File | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [resumeParsed, setResumeParsed] = useState(false);

  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const [answerInput, setAnswerInput] = useState('');
  const [timer, setTimer] = useState(0);

  // Timer logic
  useEffect(() => {
    if (!questions.length || currentQuestionIndex >= questions.length) return;

    setTimer(getTimeByDifficulty(questions[currentQuestionIndex].difficulty));
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleSubmitAnswer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestionIndex, questions]);

  const getTimeByDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 20;
      case 'medium': return 60;
      case 'hard': return 120;
      default: return 30;
    }
  };

  // Helper function to check if a value is valid (not null, undefined, or empty string)
  const isValidValue = (value: string | null | undefined): boolean => {
    return value !== null && value !== undefined && value.trim() !== '';
  };

  const isInterviewReady = isValidValue(candidateInfo.name) && questions.length > 0;

const handleFileUpload = async () => {
  if (!file) return;
  setLoading(true);
  try {
    // 1. Parse resume
    const formData = new FormData();
    formData.append('file', file);
    const parseRes = await fetch('https://docura-parser.onrender.com/parse?remove_emails=false', {
      method: 'POST',
      body: formData
    });
    const parseData = await parseRes.json();
    const resumeText = parseData.text;

    // 2. Extract info
    const infoRes = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: 'extract_contact_info', text: resumeText })
    });
    const infoData = await infoRes.json();
    const infoDataText = infoData.text || "";
    const cleanedText = infoDataText.replace(/```(?:json)?\n?/g, '').replace(/```$/g, '').trim();
    
    let parsedInfo: CandidateInfo = {};
    try {
      parsedInfo = JSON.parse(cleanedText);
    } catch (err) {
      console.error("Failed to parse candidate info:", err);
    }

    setCandidateInfo(parsedInfo);
    setResumeParsed(true); 

    // 3. Check for missing fields right away
    const fields: string[] = [];
    if (!isValidValue(parsedInfo.name)) fields.push('name');
    if (!isValidValue(parsedInfo.email)) fields.push('email');
    if (!isValidValue(parsedInfo.phone)) fields.push('phone');

    if (fields.length > 0) {
      setMissingFields(fields);   // 🚀 triggers form UI
      return; // stop here
    }
      // 3. Generate questions via Gemini
      const qRes = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'generate_interview_questions', role: 'Full Stack Developer', difficulty: ['easy','medium','hard'], count_per_level: 2 })
      });
      const qData = await qRes.json();
        console.log("Generated Questions:", qData);
      setQuestions(qData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const handleSubmitMissingInfo = async () => {
  const fields: string[] = [];
  if (!isValidValue(candidateInfo.name)) fields.push('name');
  if (!isValidValue(candidateInfo.email)) fields.push('email');
  if (!isValidValue(candidateInfo.phone)) fields.push('phone');

  if (fields.length > 0) {
    setMissingFields(fields); // update state
    return; // stop, user needs to fill missing info
  }

  setMissingFields([]); // clear if everything is filled
  setLoading(true);

  try {
    const qRes = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task: 'generate_interview_questions',
        role: 'Full Stack Developer',
        difficulty: ['easy', 'medium', 'hard'],
        count_per_level: 2
      }),
    });
    const qData = await qRes.json();
    setQuestions(qData);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setAnswerInput('');
  } catch (err) {
    console.error("Failed to generate questions:", err);
  } finally {
    setLoading(false);
  }
};


const handleSubmitAnswer = () => {
  if (!questions.length || currentQuestionIndex >= questions.length) return;

  const newAnswers = [...answers];
  newAnswers[currentQuestionIndex] = answerInput;
  setAnswers(newAnswers);
  setAnswerInput('');

  setCurrentQuestionIndex(currentQuestionIndex + 1);
};

// After interview is completed, send all answers at once
useEffect(() => {
  const sendAllScores = async () => {
    if (
      questions.length &&
      answers.length === questions.length &&
      answers.every(a => a !== undefined)
    ) {
      try {
        const payload = questions.map((q, idx) => ({
          question: q.text,
          answer: answers[idx] || "",
        }));

        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: 'score_answer', answers: payload }),
        });

        // ✅ cast response to ScoreData
        const scoreData: ScoreData = await res.json();
        console.log("Raw Generated Text:", scoreData);

        // sum of all scores
        const finalScore = scoreData.results.reduce((sum, r) => sum + r.score, 0);

        // map chat
        const chat = scoreData.results.map(r => ({
          question: r.question,
          answer: r.answer,
          score: r.score,
        }));

        const finalSummary = scoreData.summary;

        dispatch(
          addCandidate({
            id: Date.now().toString(),
            name: candidateInfo.name || '',
            email: candidateInfo.email || '',
            phone: candidateInfo.phone || '',
            finalScore,
            finalSummary,
            chat,
          })
        );

        console.log("Candidate added to Redux:", {
          id: Date.now().toString(),
          name: candidateInfo.name,
          finalScore,
          finalSummary,
          chat,
        });

      } catch (err) {
        console.error("Failed to score answers:", err);
      }
    }
  };

  sendAllScores();
}, [currentQuestionIndex, questions.length, answers]);

  // Step 1: Check if we have any candidate info at all
  if (!resumeParsed && !candidateInfo.name && !candidateInfo.email && !candidateInfo.phone) {
    return (
      <Card className="max-w-md mx-auto mt-10 mb-10">
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <input type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mb-4"/>
          <Button onClick={handleFileUpload} disabled={!file || loading}>
            {loading ? 'Processing...' : 'Upload & Start Interview'}
          </Button>
        </CardContent>
      </Card>
    );
  }
  // Step 2: Check for missing or null fields and ask for user input

  if (missingFields.length > 0) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle>Complete Your Info</CardTitle>
        </CardHeader>
        <CardContent>
          {missingFields.includes('name') && (
            <Input
              value={candidateInfo.name || ''}
              onChange={(e) => setCandidateInfo({ ...candidateInfo, name: e.target.value })}
              placeholder="Enter your name"
              className="mb-2"
            />
          )}
          {missingFields.includes('email') && (
            <Input
              value={candidateInfo.email || ''}
              onChange={(e) => setCandidateInfo({ ...candidateInfo, email: e.target.value })}
              placeholder="Enter your email"
              className="mb-2"
            />
          )}
          {missingFields.includes('phone') && (
            <Input
              value={candidateInfo.phone || ''}
              onChange={(e) => setCandidateInfo({ ...candidateInfo, phone: e.target.value })}
              placeholder="Enter your phone"
              className="mb-2"
            />
          )}
          <Button
            onClick={handleSubmitMissingInfo}
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Wait until questions are loaded
  if (!isInterviewReady) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle>Preparing Interview...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please wait while we generate your questions.</p>
        </CardContent>
      </Card>
    );
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle>Interview Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Thank you {candidateInfo.name}! Your answers have been submitted.</p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Question {currentQuestionIndex + 1} / {questions.length}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{currentQuestion.text}</p>
        <Input value={answerInput} onChange={(e) => setAnswerInput(e.target.value)} placeholder="Type your answer here..." className="mb-2"/>
        <Button onClick={handleSubmitAnswer}>Submit Answer</Button>
        <div className="mt-4">
          <p>Time left: {timer}s</p>
          <Progress value={(timer / getTimeByDifficulty(currentQuestion.difficulty)) * 100} />
        </div>
      </CardContent>
    </Card>
  );
};

export default IntervieweeTab;