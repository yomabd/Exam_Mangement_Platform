import React, { useState,useEffect } from 'react';
import { FormGroup, FormLabel, Input, Select, Button } from '../dashboard/FormComponents';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useParams } from 'react-router-dom';

const EditChapter = ({chapter,qidUrl,cid,setShowEditChapter}) => {
  const [chapterName, setChapterName] = useState('');
  const [time, setTime] = useState('');
  const [instruction, setInstruction] = useState({
    heading: '',
    paragraphs: ['', '', ''],
  });
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', '', ''], correctAnswer: '' },
  ]);
  const baseUrl = "http://localhost:3005/api/questionBanks";
  // const params = useParams();

  //not needed
  useEffect(() => {
    console.log("QID is "+qid)
    axios.get(`${qidUrl}/chapters`)
    .then((response)=>{
      console.log(response.data)
    })
    .catch((error)=>{
      console.error('error occurs while fetching...', error)
    })

    console.log('coming from the chapter prop')
    console.log(chapter)

  
  }, [])

  const validateForm = () => {
    if (!chapterName || !time ||!instruction.paragraphs[0]) {
      toast.error("Please fill all required fields.");
      return false;
    }
    if(question.question) {
      if (!question.option[0] || !option[1]){
      toast.error("You can't set incomplete questions");
      return false;
    }
  }
    return true;
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };
  
  
  const handleInstructionChange = (index, value) => {
    const newParagraphs = [...instruction.paragraphs];
    newParagraphs[index] = value;
    setInstruction({ ...instruction, paragraphs: newParagraphs });
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', '', ''], correctAnswer: '' },
    ]);
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const chapterData = {
      name: chapterName,
      time,
      instruction,
      questions,
    };
    console.log(chapterData);
    try {
      const response = await axios.post(`${baseUrl}/${qid}/chapters`,
        chapterData); 
      console.log('Chapter added:', response.data);
      // Clear form after submission
      setChapterName('');
      setTime('');
      setInstruction({ heading: '', paragraphs: ['', '', ''] });
      setQuestions([{ question: '', options: ['', '', '', '', ''], correctAnswer: '' }]);
    } catch (error) {
      console.error('Error adding chapter:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Create Chapter</h2>
      <form onSubmit={handleAddChapter}>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Chapter Details</h3>
          <FormGroup>
            <FormLabel htmlFor="chapterName" required>
              Chapter Name:
            </FormLabel>
            <Input
              type="text"
              id="chapterName"
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="time" required>Time (in minutes):</FormLabel>
            <Input
              type="number"
              id="time"
              value={time}
              min={0}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </FormGroup>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Instruction</h3>
          <FormGroup>
            <FormLabel htmlFor="instructionHeading">Instruction Heading:</FormLabel>
            <Input
              type="text"
              id="instructionHeading"
              value={instruction.heading}
              onChange={(e) => setInstruction({ ...instruction, heading: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="instructionParagraph1" required>
              Instruction Paragraph 1:
            </FormLabel>
            <Input
              type="text"
              id="instructionParagraph1"
              value={instruction.paragraphs[0]}
              onChange={(e) => handleInstructionChange(0, e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="instructionParagraph2">Instruction Paragraph 2:</FormLabel>
            <Input
              type="text"
              id="instructionParagraph2"
              value={instruction.paragraphs[1]}
              onChange={(e) => handleInstructionChange(1, e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="instructionParagraph3">Instruction Paragraph 3:</FormLabel>
            <Input
              type="text"
              id="instructionParagraph3"
              value={instruction.paragraphs[2]}
              onChange={(e) => handleInstructionChange(2, e.target.value)}
            />
          </FormGroup>
        </div>

        {questions.map((question, qIndex) => (
  <div key={qIndex} className="mb-6">
    <h3 className="text-xl font-semibold mb-2">Question {qIndex + 1}</h3>
    <Button type="button" onClick={() => removeQuestion(qIndex)}>Remove Question</Button>
            <FormGroup>
              <FormLabel htmlFor={`question${qIndex}`} required ={question.question.trim()!==""}>
                Question:
              </FormLabel>
              <Input
                type="text"
                id={`question${qIndex}`}
                value={question.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                required
              />
            </FormGroup>
            {question.options.map((option, oIndex) => (
              <FormGroup key={oIndex}>
                <FormLabel htmlFor={`option${qIndex}-${oIndex}`} required={oIndex === 0 && question.question.trim()!=='' || oIndex ===1
              && question.question.trim()!==''}>
                  Option {oIndex + 1}:
                </FormLabel>
                <Input
                  type="text"
                  id={`option${qIndex}-${oIndex}`}
                  value={option}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  required={(oIndex === 0  || oIndex ===1)
                  && question.question.trim()!==''}
                />
              </FormGroup>
            ))}
            <FormGroup>
              <FormLabel htmlFor={`correctAnswer${qIndex}`} required={question.question.trim()!==''}>
                Correct Answer:
              </FormLabel>
              <Select
                id={`correctAnswer${qIndex}`}
                value={question.correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                required ={question.options[0] && question.options[1]
                  && question.question.trim()!==''}
              >
                <option value="">Select Correct Answer</option>
                {question.options.map((option, oIndex) => (
                  <option key={oIndex} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </div>
        ))}

        <div className="flex justify-between gap-4 mt-4">
          <Button type="button" onClick={addQuestion}>
            Add Question
          </Button>
          <Button type="submit" onClick={handleAddChapter}>Save Chapter</Button>
          <Button type="button" onClick={() => (window.location.href = '/dashboard')}>
            Go to Dashboard
          </Button>
          <Button type="button" onClick={() => (window.location.href = '/exams')}>
            Exams
          </Button>
        </div>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default EditChapter;
