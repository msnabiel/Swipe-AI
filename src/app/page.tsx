"use client"
import { motion } from "framer-motion"
import { ArrowRight} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link";
const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}
import SplineScene from "@/components/spline";

export default function Home() {
  
  return (

    <motion.section
      initial="hidden"
      animate="show"
      variants={stagger}
      className="bg-gradient-to-br from-[#E0F7FA] via-white to-[#FFF3E0] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] text-center"
    >
   <section className="relative w-full min-h-[95vh] flex items-center bg-gradient-to-b from-background via-indigo-50/40 to-background dark:via-indigo-900/10 overflow-hidden">
      {/* Background accents */}
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-indigo-300/30 via-purple-200/30 to-transparent blur-3xl opacity-50" />
      <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-pink-300/30 via-violet-200/30 to-transparent blur-3xl opacity-50" />

      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 relative z-10 my-8">
        
        {/* Left: Text */}
        <div className="flex-1 text-center md:text-left space-y-6">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl font-bold tracking-tight"
          >
            Interviews Made <span className="text-primary">Effortless</span>, <br className="hidden sm:block"/> Evaluations Made Smarter
          </motion.h1>

          {/* Supporting copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto md:mx-0"
          >
            From resume parsing to AI-driven question generation, <span className="font-semibold text-foreground">Swipe AI AI</span> handles the details with precision —
            helping recruiters save time, candidates stay focused, and teams make better hiring decisions.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <Link href="/interviewer">
            <Button size="lg">
              Interviewee
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            </Link>
            <Link href="/interviewee">
            <Button size="lg" variant="outline">
              Interviewer
            </Button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="pt-8"
          >
            <p className="text-sm font-medium text-muted-foreground mb-4">
              Trusted by finance teams across India
            </p>
            <div className="flex -space-x-4 justify-center md:justify-start">
              {["/auth.jpg","/auth.jpg","/auth.jpg","/auth.jpg","/auth.jpg"].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="User"
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-background shadow-sm"
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Screenshot / Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex-1 relative w-full"
        >
          <div className="rounded-xl border bg-card shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Browser bar */}
            <div className="bg-muted h-8 flex items-center px-3 space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            {/* Screenshot */}
            <div className="relative w-full h-[350px] md:h-[450px]">
<img
  src="/auth.jpg"
  alt="App dashboard preview"
  className="object-cover w-full h-full"
/>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

      {/* Additional sections below */}


    </motion.section>
  )
}
