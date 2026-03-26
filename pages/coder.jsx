import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import axiosClient from '../utils/axiosClient';
import { useParams } from 'react-router';

const CodingInterface = () => {
  const [problem,setProblem] = useState(null);
  const [loading,setLoading] = useState(false);
  let {problemId} = useParams();
  const [code, setCode] = useState('');
  const [selectedLanguage,setSelectedLanguage] = useState('cpp');
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'solution', 'submission'


useEffect(()=>{
     const fetchProblem = async ()=>{
           setLoading(true);         
           try{
                const response = await axiosClient.get(`/problem/problemById/${problemId}`);
               console.log(response.data);
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
    



  
},[])

  const handleEditorChange = (value) => {
    setCode(value);
  };

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
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a>Run</a>
            </li>
            <li>
              <a>Submit</a>
            </li>
            <li>
              <a>Ai Help</a>
            </li>
          </ul>
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
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'solution' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('solution')}
              >
                Solution
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'submission' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('submission')}
              >
                Submission
              </button>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="px-6 py-6">
            {/* Description Tab Content */}
            {activeTab === 'description' && (
              <>
                <h1 className="text-2xl font-bold mb-4">Problem Title: Two Sum</h1>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Problem Description</h2>
                  <p className="text-gray-800">
                    Given an array of integers <code className="bg-gray-100 px-1 rounded">nums</code> and an integer{' '}
                    <code className="bg-gray-100 px-1 rounded">target</code>, return the indices of the two numbers that add
                    up to <code className="bg-gray-100 px-1 rounded">target</code>.
                  </p>
                  <p className="mt-2 text-gray-800">
                    You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the
                    same element twice. You can return the answer in any order.
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Problem Example</h2>
                  <div className="bg-gray-50 p-3 rounded-md mb-3">
                    <p className="font-medium">Example 1:</p>
                    <pre className="text-sm mt-1 whitespace-pre-wrap">
                      Input: nums = [2,7,11,15], target = 9 Output: [0,1] Explanation: Because nums[0] + nums[1] == 9, we
                      return [0, 1].
                    </pre>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md mb-3">
                    <p className="font-medium">Example 2:</p>
                    <pre className="text-sm mt-1 whitespace-pre-wrap">
                      Input: nums = [3,2,4], target = 6 Output: [1,2]
                    </pre>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">Example 3:</p>
                    <pre className="text-sm mt-1 whitespace-pre-wrap">
                      Input: nums = [3,3], target = 6 Output: [0,1]
                    </pre>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Constraints</h2>
                  <ul className="list-disc list-inside text-gray-800 space-y-1">
                    <li>2 &lt;= nums.length &lt;= 10⁴</li>
                    <li>-10⁹ &lt;= nums[i] &lt;= 10⁹</li>
                    <li>-10⁹ &lt;= target &lt;= 10⁹</li>
                    <li>Only one valid answer exists.</li>
                  </ul>
                </div>
              </>
            )}

            {/* Solution Tab Content */}
            {activeTab === 'solution' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Solution Approach</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Intuition</h3>
                  <p>
                    The brute force approach would be to check every pair of numbers, which takes O(n²) time. 
                    We can do better by using a hash map to store numbers we've seen so far. For each number, 
                    we compute the complement (target - current number). If the complement exists in our map, 
                    we have found the solution.
                  </p>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Algorithm</h3>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Initialize an empty Map.</li>
                    <li>Iterate through the array with index i.</li>
                    <li>Calculate complement = target - nums[i].</li>
                    <li>If the complement is already in the map, return [map.get(complement), i].</li>
                    <li>Otherwise, store the current number and its index in the map: map.set(nums[i], i).</li>
                    <li>If no solution is found (though the problem guarantees one), return an empty array.</li>
                  </ol>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Complexity</h3>
                  <ul className="list-disc list-inside">
                    <li><strong>Time Complexity:</strong> O(n) – we traverse the list once, and map operations are O(1).</li>
                    <li><strong>Space Complexity:</strong> O(n) – the map stores at most n elements.</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Code (JavaScript)</h3>
                  <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                    {`function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`}
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
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2"><span className="badge badge-success">Accepted</span></td>
                        <td>68 ms</td>
                        <td>42.1 MB</td>
                        <td>JavaScript</td>
                        <td>Just now</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2"><span className="badge badge-error">Wrong Answer</span></td>
                        <td>-</td>
                        <td>-</td>
                        <td>JavaScript</td>
                        <td>5 minutes ago</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2"><span className="badge badge-success">Accepted</span></td>
                        <td>72 ms</td>
                        <td>41.9 MB</td>
                        <td>JavaScript</td>
                        <td>1 hour ago</td>
                      </tr>
                      <tr>
                        <td className="py-2"><span className="badge badge-warning">Time Limit Exceeded</span></td>
                        <td>N/A</td>
                        <td>N/A</td>
                        <td>JavaScript</td>
                        <td>Yesterday</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 text-sm text-gray-500">
                  <p>Note: Submissions are tracked when you click "Submit" from the navbar.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Monaco Code Editor with bottom empty space */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden pb-6">
          <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
            <span className="font-medium text-gray-700">Solution (JavaScript)</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              width="100%"
              language="javascript"
              theme="vs-light"
              value={code}
              onChange={handleEditorChange}
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