'use client';
import React, { useState } from 'react';
import { LearningProvider, useLearning } from '../context/LearningContext';
import { Navbar } from './Navbar';
import { RoadmapView } from './RoadmapView';
import { CustomPractice } from './CustomPractice';
import { WrongQuestionsReview } from './WrongQuestionsReview';
import { ParentDashboard } from './ParentDashboard';
import { BadgesModal } from './BadgesModal';
import { QuizArena } from './QuizArena';
import { ResultModal } from './ResultModal';
import { ExplanationView } from './ExplanationView';

const MainContent = () => {
  const { saveQuizResult, getQuestionsByWeek, currentSubject, isMath } = useLearning();
  const [currentTab, setCurrentTab] = useState('roadmap'); // 'roadmap' | 'practice' | 'wrong' | 'dashboard' | 'badges'
  const [activeQuizConfig, setActiveQuizConfig] = useState(null);
  const [currentResultData, setCurrentResultData] = useState(null);
  const [currentEarnedRewards, setCurrentEarnedRewards] = useState(null);
  const [isViewingExplanation, setIsViewingExplanation] = useState(false);

  // Start a Quiz
  const handleStartQuiz = (config) => {
    let questions = config.questions;
    if (!questions && config.week) {
      const weekQuestions = getQuestionsByWeek(config.week);
      if (config.difficulty && config.difficulty !== 'all') {
        questions = weekQuestions.filter(q => q.difficulty === config.difficulty);
      }
      if (!questions || questions.length === 0) {
        questions = weekQuestions;
      }
    }

    if (!questions || questions.length === 0) {
      alert("Chưa có câu hỏi cho phần này!");
      return;
    }

    // Prepare questions
    const preparedQuestions = questions.map(q => ({ ...q }));
    const timeLimit = config.timeLimitSec || Math.max(300, preparedQuestions.length * 75); // 75s per question

    setActiveQuizConfig({
      type: config.type || 'week',
      week: config.week || null,
      title: config.title || `Luyện tập Tuần ${config.week || ''}`,
      questions: preparedQuestions,
      timeLimitSec: timeLimit
    });
    setCurrentResultData(null);
    setIsViewingExplanation(false);
  };

  // Finish Quiz & Submit
  const handleFinishQuiz = (resultPayload) => {
    const fullResultData = {
      ...resultPayload,
      subject: currentSubject,
      type: activeQuizConfig.type,
      week: activeQuizConfig.week,
      title: activeQuizConfig.title
    };

    const rewards = saveQuizResult(fullResultData);
    setCurrentResultData(fullResultData);
    setCurrentEarnedRewards(rewards);
  };

  // Retry Current Quiz
  const handleRetryCurrentQuiz = () => {
    if (!activeQuizConfig) return;
    const restartConfig = { ...activeQuizConfig };
    setCurrentResultData(null);
    setIsViewingExplanation(false);
    setActiveQuizConfig(restartConfig);
  };

  // Retry Wrong Only Questions
  const handleRetryWrongOnly = () => {
    if (!currentResultData) return;
    const wrongItems = currentResultData.details.filter(d => !d.isCorrect);
    if (wrongItems.length === 0) return;

    const wrongQuestions = wrongItems.map(d => d.question);
    setActiveQuizConfig({
      type: 'retry_wrong',
      week: currentResultData.week,
      title: `Luyện Lại Câu Sai (${wrongQuestions.length} câu)`,
      questions: wrongQuestions,
      timeLimitSec: Math.max(180, wrongQuestions.length * 90)
    });
    setCurrentResultData(null);
    setIsViewingExplanation(false);
  };

  // Exit Quiz
  const handleExitQuiz = () => {
    setActiveQuizConfig(null);
    setCurrentResultData(null);
    setIsViewingExplanation(false);
  };

  return (
    <div className={`min-h-screen font-nunito text-slate-800 ${
      isMath 
        ? 'bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30' 
        : 'bg-gradient-to-b from-rose-50/50 via-white to-purple-50/30'
    }`}>
      {/* Top Navigation */}
      <Navbar 
        currentTab={currentTab} 
        onSelectTab={(tab) => {
          if (tab === 'badges') {
            setCurrentTab('badges');
          } else {
            setCurrentTab(tab);
          }
        }} 
      />

      {/* Main Tab Routing */}
      <main className="pb-16 pt-4">
        {currentTab === 'roadmap' && (
          <RoadmapView onStartQuiz={handleStartQuiz} />
        )}

        {currentTab === 'practice' && (
          <CustomPractice onStartQuiz={handleStartQuiz} />
        )}

        {currentTab === 'wrong' && (
          <WrongQuestionsReview onStartQuiz={handleStartQuiz} />
        )}

        {currentTab === 'dashboard' && (
          <ParentDashboard />
        )}

        {currentTab === 'badges' && (
          <BadgesModal onClose={() => setCurrentTab('roadmap')} />
        )}
      </main>

      {/* Quiz Modal Player */}
      {activeQuizConfig && !currentResultData && (
        <QuizArena
          quizConfig={activeQuizConfig}
          onFinish={handleFinishQuiz}
          onExit={handleExitQuiz}
        />
      )}

      {/* Result Celebration Modal */}
      {currentResultData && !isViewingExplanation && (
        <ResultModal
          resultData={currentResultData}
          onReview={() => setIsViewingExplanation(true)}
          onRetry={handleRetryCurrentQuiz}
          onRetryWrong={handleRetryWrongOnly}
          onExit={handleExitQuiz}
        />
      )}

      {/* Step-by-Step Explanation Review Modal */}
      {currentResultData && isViewingExplanation && (
        <ExplanationView
          resultData={currentResultData}
          onClose={() => setIsViewingExplanation(false)}
          onRetry={handleRetryCurrentQuiz}
          onExit={handleExitQuiz}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <LearningProvider>
      <MainContent />
    </LearningProvider>
  );
}
