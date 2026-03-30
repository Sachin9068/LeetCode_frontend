import React, { useEffect, useState,useRef } from 'react';
import Editor from '@monaco-editor/react';
import axiosClient from '../utils/axiosClient';
import { useParams } from 'react-router';
import { success } from 'zod';

const CodingInterface = () => {
  const [problem,setProblem] = useState(null);
  const [loading,setLoading] = useState(false);
  let {problemId} = useParams();
  const [code, setCode] = useState('');
  const [selectedLanguage,setSelectedLanguage] = useState('');
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'solution', 'submission'
  const [runResult, setRunResult] = useState(null);
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [submitResult, setSubmitResult] = useState(null);
  const [submitCode,setSubmitCode] = useState([]);
  const editorRef = useRef(null);
  const [exicution, setExicution] = useState(0);

useEffect(()=>{
     const fetchProblem = async ()=>{
           setLoading(true);         
           try{
                const response = await axiosClient.get(`/problem/problemById/${problemId}`);
                const initialcode = response.data?.startcode?.find((sc)=>{
                  if(sc.language == "cpp" && selectedLanguage == 'cpp') return true;
                  else if(sc.language == "java" && selectedLanguage == 'java') return true;
                  else if(sc.language == "javascript" && selectedLanguage == 'javascript') return true;
                  
                  return false;
                })?.initialcode || 'hello';

                setProblem(response.data);
                setCode(initialcode);
                setLoading(false);

           }   
           catch(error){
              console.error('Error Fetching Problem : ',error);
              setLoading(false);
           }
     };
   fetchProblem();


},[problemId])

useEffect(()=>{
    
if(problem){
  const initialcode = problem.startcode?.find(sc=>sc.language === selectedLanguage)?.initialcode || "wrong";
  setCode(initialcode);
}

},[selectedLanguage,problem])


useEffect(()=>{


  const FetchSubmitCode = async ()=>{
    
    if (activeTab !== 'submission') return;
    setLoading(true);
    try{
      
          const response = await axiosClient.get(`/submission/submit/${problemId}`);
          console.log(response?.data);
          setSubmitCode(response?.data);
          setLoading(false);
          
    }
    catch(error){
      console.error("FetchSubmitCode Error : ",error);
      setLoading(false);
    }
  };

  FetchSubmitCode();

},[problemId,activeTab]);



  const handleEditorChange = (value) => {
    setCode(value || "123");
  };

  const handleEditorDidMount = (editor)=>{
    editorRef.current = editor;
  }

    const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async ()=>{
    setExicution(1); 
    setLoading(true);
    setRunResult(null);

    try{
       const response = await axiosClient.post(`/submission/run/${problemId}`,{
       code,
       language:selectedLanguage
       });

       setRunResult(response.data);
       setLoading(false);
       setActiveRightTab('run');
      
    }
    catch(error){
        console.error('Error running code:', error);
        setRunResult({
          success:false,
          error:'Internal server error'
        });
        setLoading(false);
        setActiveRightTab('run');  
    }

  }

  

  const handleSubmitCode = async ()=>{
     setExicution(1);
    setLoading(true);
    setSubmitResult(null);
    try{
        const response = await axiosClient.post(`/submission/submit/${problemId}`,{
          code:code,
          language:selectedLanguage
        });

        setSubmitResult(response.data);
        setLoading(false);
        setActiveRightTab(result);
    }
    catch(error){
       console.error('Error Submitting code : ',error);
       setSubmitResult(null);
       setLoading(false);
       setActiveRightTab('result');
    }
    
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

   if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )};

    function RunSubmitbtn(){
          return (
            <div className="px-6 py-6">
                {activeRightTab === 'run' && (<h1>{runResult}</h1>)}

                {activeRightTab === 'submit' && (<h1>hello submit</h1>)}

                {activeRightTab === 'ai help' && (<h1>hello ai</h1>)}
            </div>
          )
    }

    function ProblemShowcasebtn(){
        return (
          <>
             {/* Scrollable Content Area */}
          <div className="px-6 py-6">
            {/* Description Tab Content */}
            {activeTab === 'description' && (
              <>
                <h1 className="text-2xl font-bold mb-4">Problem Title: {problem?.title}</h1>
                 <div className={`badge badge-outline ${getDifficultyColor(problem?.dificultylevel)}`}>
                      {problem?.dificultylevel?.charAt(0).toUpperCase() + problem?.dificultylevel?.slice(1)}
                  </div>

                 <div className={`ml-1 badge badge-outline ${getDifficultyColor(problem?.tag)}`}>
                      {problem?.tag?.charAt(0).toUpperCase()+ problem?.tag?.slice(1)}
                  </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Problem Description</h2>
                 
                  <p className="mt-2 text-gray-800">{problem?.description}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Problem Example</h2>
                   
                   {problem?.visibletestcase?.map((example,index)=>(
                      <div className="bg-gray-50 p-3 rounded-md mb-3">
                        <p className="font-medium">Example {index+1} :</p>
                        <pre className="text-sm mt-1 whitespace-pre-wrap">
                          <strong>Input:</strong> {example?.input}, 
                          <strong>Output:</strong> {example?.output},
                          <strong>Explantion:</strong> {example?.explantion}
                      </pre>
                  </div>
                   ))}

                  
                  
                </div>

                {/* <div>
                  <h2 className="text-xl font-semibold mb-2">Constraints</h2>
                  <ul className="list-disc list-inside text-gray-800 space-y-1">
                    <li>2 &lt;= nums.length &lt;= 10⁴</li>
                    <li>-10⁹ &lt;= nums[i] &lt;= 10⁹</li>
                    <li>-10⁹ &lt;= target &lt;= 10⁹</li>
                    <li>Only one valid answer exists.</li>
                  </ul>
                </div> */}
              </>
            )}

            {/* Solution Tab Content */}
            {activeTab === 'solution' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Solution Approach</h2>
               
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">{code}</h3>
                  <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                    {problem?.referenceSolution?.map((solution,index)=>{
                      <>
                         <div className="bg-base-200 px-4 py-2 rounded-t-lg">
                          <h3 className="font-semibold">{problem?.title} - {solution?.language}</h3>
                        </div>
                         <div className="p-4">
                          <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
                            <code>{solution?.completecode}</code>
                          </pre>
                        </div>

                      </>
                        
                    }) || <p className="text-gray-500">Solutions will be available after you solve the problem.</p>}
                  </pre>
                </div>
              </div>
            )}

            {/* Submission Tab Content */}
            {activeTab === 'submission' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Submissions</h2>
                <p className="text-gray-500 mb-4">Your previous submissions for this problem:</p>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                 

                     <thead>
                          <tr className="border-b border-gray-200">
                          <th className="text-left py-2">Status</th>
                          <th className="text-left py-2">Runtime</th>
                          <th className="text-left py-2">Memory</th>
                          <th className="text-left py-2">Language</th>
                          <th className="text-left py-2">Submitted</th>
                          </tr>
                      </thead>
               {submitCode.map((sub)=>(
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2"><span className="badge badge-success">{sub?.status}</span></td>
                        <td>{sub?.runtime}</td>
                        <td>{sub?.memory}</td>
                        <td>{sub?.language}</td>
                        <td>{sub?.updatedAt}</td>
                      </tr>

                    </tbody>

                  ))
                   
                  }
                   

                  </table>
                </div>
                <div className="mt-6 text-sm text-gray-500">
                  <p>Note: Submissions are tracked when you click "Submit" from the navbar.</p>
                </div>
              </div>
            )}


          </div>
          </>
          )
    }

  return (
    <div className="flex flex-col h-screen bg-white text-black">
      {/* Navbar – fixed height */}
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Parent</a>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">ForceFullyCoder</a>
        </div>
        <div className="navbar-center lg:flex">
              <button
                className={`btn btn-sm ${activeRightTab === 'run' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={handleRun}
              >
                Run
              </button>

              <button
                className={`btn btn-sm ${activeRightTab === 'submit' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={handleSubmitCode}>Submit
              </button>

              <button
                className={`btn btn-sm ${activeRightTab === 'ai help' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setExicution(1)}   
               >Ai Help
              </button>
        </div>
        <div className="navbar-end">
          <a className="btn">Button</a>
        </div>
      </div>

      {/* Main content – takes remaining height */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* LEFT SIDE: Tabbed Content (Description / Solution / Submission) */}
      <div className="flex-1 overflow-auto border-r border-gray-200">
          {/* Sticky Tab Buttons */}
          <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-2 border-b border-gray-200">
            <div className="flex gap-2">
              <button
                className={`btn btn-sm ${activeTab === 'description' ? 'btn-primary' : 'btn-ghost'}`}
               onClick={() => {
                   setActiveTab('description');
                   setExicution(0);
                }}
              >
                Description
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'solution' ? 'btn-primary' : 'btn-ghost'}`}
               onClick={() => {
                    setActiveTab('solution');
                    setExicution(0);
                  }}
              >
                Solution
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'submission' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => {
                    setActiveTab('submission');
                    setExicution(0);
                  }}
              >
                Submission
              </button>
            </div>
          </div>

       {exicution ? RunSubmitbtn() : ProblemShowcasebtn() };
        

         
         

          </div>
       
       

        {/* RIGHT SIDE: Monaco Code Editor with bottom empty space */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden pb-6">
          <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
             <select 
             className="select select-bordered select-sm w-full max-w-xs"
              value={selectedLanguage}
              onClick={(e) => handleLanguageChange(e.target.value)}
              >
             <option value="javascript">JavaScript</option>
             <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
       </select>
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              width="100%"
              language={selectedLanguage}
              theme="vs-light"
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                automaticLayout: true,
                wordWrap: 'on',
                lineNumbers: 'on',
                renderWhitespace: 'boundary',
                tabSize: 2,
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible',
                  useShadows: false,
                  verticalHasArrows: false,
                  horizontalHasArrows: false,
                  verticalScrollbarSize: 0,
                  horizontalScrollbarSize: 0,
                },
              }}
            />
          </div>

          

        </div>
      </div>
    </div>
  );
};

export default CodingInterface;