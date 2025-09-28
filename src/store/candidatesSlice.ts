import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  finalScore: number;
  finalSummary: string;
  chat: { question: string; answer: string; score: number }[];
}

interface CandidatesState {
  candidates: Candidate[];
}

const initialState: CandidatesState = {
  candidates: [],
};

const candidatesSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {
    deleteCandidate: (state, action: PayloadAction<string>) => {
      state.candidates = state.candidates.filter(
        (candidate) => candidate.id !== action.payload
      );
    },
  },
});

export const { deleteCandidate } = candidatesSlice.actions;
export default candidatesSlice.reducer;