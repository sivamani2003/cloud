// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Editor from "@monaco-editor/react";
// import io from "socket.io-client";
// import ChatBot from './ChatBot'; // Make sure the path is correct

// // Connect to the Socket.IO server
// const socket = io("http://localhost:5002");

// const Home = ({ user }) => {
//   const [code, setCode] = useState("");
//   const [shareEmail, setShareEmail] = useState("");
//   const [language, setLanguage] = useState("javascript");
//   const [theme, setTheme] = useState("light");
//   const [output, setOutput] = useState("");
//   const [isLiveSession, setIsLiveSession] = useState(false);
//   const [liveSessionStatus, setLiveSessionStatus] = useState("");

//   useEffect(() => {
//     const fetchLiveSessionCode = async () => {
//       if (user) {
//         try {
//           const response = await axios.get(
//             `http://localhost:5002/getLiveSessionCode/${user.email}`
//           );
//           if (response.data) {
//             setCode(response.data.code); // Load shared code into the editor
//           }
//         } catch (error) {
//           console.error("Error fetching live session code:", error);
//         }
//       }
//     };

//     fetchLiveSessionCode();

//     // Listen for code updates from the server
//     socket.on("codeUpdate", (updatedCode) => {
//       setCode(updatedCode); // Update the code in real-time when received
//     });

//     // Listen for welcome message when joining the session
//     socket.on("welcome", (data) => {
//       alert(data.message);
//     });

//     // Listen for session ended notification
//     socket.on("sessionEnded", (data) => {
//       setIsLiveSession(false);
//       setLiveSessionStatus("");
//       alert("The live session has ended.");
//     });

//     return () => {
//       socket.off("codeUpdate");
//       socket.off("welcome");
//       socket.off("sessionEnded"); // Clean up the session ended listener
//     };
//   }, [user]);

//   const saveCode = async () => {
//     if (user && code) {
//       try {
//         await axios.post("http://localhost:5002/saveCode", {
//           email: user.email,
//           code,
//         });
//         alert("Code saved successfully!");
//         setCode("");
//       } catch (error) {
//         console.error("Error saving code:", error);
//         alert("Error saving code. Please try again.");
//       }
//     }
//   };

//   const shareCode = async () => {
//     if (user && code && shareEmail) {
//       try {
//         await axios.post("http://localhost:5002/shareCode", {
//           email: user.email,
//           recipientEmail: shareEmail,
//           code,
//         });
//         alert(`Code shared with ${shareEmail}!`);
//         setShareEmail("");
//         // Notify recipient to join the live session
//         socket.emit("joinLiveSession", { email: shareEmail });
//       } catch (error) {
//         console.error("Error sharing code:", error);
//         alert("Error sharing code. Please try again.");
//       }
//     } else {
//       alert("Please enter a valid email and code to share.");
//     }
//   };

//   const runCode = async () => {
//     try {
//       const response = await axios.post("http://localhost:5002/runCode", {
//         code,
//         language,
//       });

//       if (response.data) {
//         setOutput(response.data.output); // Set the output directly to show logs or result
//       }
//     } catch (error) {
//       console.error("Error running code:", error);
//       setOutput("Error running code. Please try again.");
//     }
//   };

//   const handleCodeChange = (newCode) => {
//     setCode(newCode);
//     if (isLiveSession) {
//       socket.emit("codeUpdate", newCode); // Send the updated code to the server only during live session
//     }
//   };

//   const startLiveSession = () => {
//     if (!isLiveSession) {
//       setIsLiveSession(true);
//       socket.emit("joinLiveSession", { email: user.email }); // Notify server to start live session
//       setLiveSessionStatus("Live session active");
//       alert("Live session started! You are now broadcasting code.");
//     } else {
//       alert("You are already in a live session.");
//     }
//   };

//   const stopLiveSession = () => {
//     if (isLiveSession) {
//       socket.emit("stopLiveSession", { email: user.email }); // Notify server to stop live session
//       setIsLiveSession(false);
//       setLiveSessionStatus("");
//       alert("Live session has been stopped.");
//     } else {
//       alert("You are not in a live session.");
//     }
//   };

//   return (
//     <div className="mt-6">
//       <h1 className="text-2xl font-bold mb-4">Welcome to Code Editor</h1>
//       {user ? (
//         <>
//           {liveSessionStatus && (
//             <div className="bg-green-200 text-green-700 p-2 rounded mb-4">
//               {liveSessionStatus} for {user.email}
//             </div>
//           )}

//           <div className="flex items-center justify-between mb-4">
//             <select
//               value={language}
//               onChange={(e) => setLanguage(e.target.value)}
//               className="border p-2"
//             >
//               <option value="javascript">JavaScript</option>
//               <option value="python">Python</option>
//               <option value="c">C</option>
//               <option value="c++">C++</option>
//               <option value="java">Java</option>
//               {/* Add more languages here if needed */}
//             </select>
//             <button
//               onClick={startLiveSession}
//               className="bg-blue-500 text-white p-2 rounded"
//             >
//               Start Live Session
//             </button>
//             <button
//               onClick={stopLiveSession}
//               className="bg-red-500 text-white p-2 rounded"
//             >
//               Stop Live Session
//             </button>
//           </div>

//           <div className="flex items-center mb-4">
//             <input
//               type="text"
//               value={shareEmail}
//               onChange={(e) => setShareEmail(e.target.value)}
//               placeholder="Email to share code"
//               className="border p-2 mr-2 flex-grow"
//             />
//             <button
//               onClick={shareCode}
//               className="bg-green-500 text-white p-2 rounded"
//             >
//               Share Code
//             </button>
//           </div>

//           <Editor
//             height="400px"
//             defaultLanguage={language}
//             value={code} // Updated to use controlled component
//             onChange={handleCodeChange}
//             theme={theme}
//           />

//           <div className="flex justify-between mt-4">
//             <button
//               onClick={saveCode}
//               className="bg-yellow-500 text-white p-2 rounded"
//             >
//               Save Code
//             </button>
//             <button
//               onClick={runCode}
//               className="bg-red-500 text-white p-2 rounded"
//             >
//               Run Code
//             </button>
//           </div>

//           <h2 className="text-xl font-bold mt-6">Output</h2>
//           <pre className="border p-4">{output}</pre>

//           {/* ChatBot Integration */}
//           <ChatBot />
//         </>
//       ) : (
//         <p>Please log in to use the code editor.</p>
//       )}
//     </div>
//   );
// };

// export default Home;
import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import io from "socket.io-client";
import ChatBot from './ChatBot.jsx'; // Make sure the path is correct

// Connect to the Socket.IO server
const socket = io("http://localhost:5002");

const Home = ({ user }) => {
  const [code, setCode] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("light");
  const [output, setOutput] = useState("");
  const [userInput, setUserInput] = useState(""); // State for user input
  const [isLiveSession, setIsLiveSession] = useState(false);
  const [liveSessionStatus, setLiveSessionStatus] = useState("");

  useEffect(() => {
    const fetchLiveSessionCode = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `http://localhost:5002/getLiveSessionCode/${user.email}`
          );
          if (response.data) {
            setCode(response.data.code); // Load shared code into the editor
          }
        } catch (error) {
          console.error("Error fetching live session code:", error);
        }
      }
    };

    fetchLiveSessionCode();

    // Listen for code updates from the server
    socket.on("codeUpdate", (updatedCode) => {
      setCode(updatedCode); // Update the code in real-time when received
    });

    // Listen for welcome message when joining the session
    socket.on("welcome", (data) => {
      alert(data.message);
    });

    // Listen for session ended notification
    socket.on("sessionEnded", (data) => {
      setIsLiveSession(false);
      setLiveSessionStatus("");
      alert("The live session has ended.");
    });

    return () => {
      socket.off("codeUpdate");
      socket.off("welcome");
      socket.off("sessionEnded"); // Clean up the session ended listener
    };
  }, [user]);

  const saveCode = async () => {
    if (user && code) {
      try {
        await axios.post("http://localhost:5002/saveCode", {
          email: user.email,
          code,
        });
        alert("Code saved successfully!");
        setCode("");
      } catch (error) {
        console.error("Error saving code:", error);
        alert("Error saving code. Please try again.");
      }
    }
  };

  const shareCode = async () => {
    if (user && code && shareEmail) {
      try {
        await axios.post("http://localhost:5002/shareCode", {
          email: user.email,
          recipientEmail: shareEmail,
          code,
        });
        alert(`Code shared with ${shareEmail}!`);
        setShareEmail("");
        // Notify recipient to join the live session
        socket.emit("joinLiveSession", { email: shareEmail });
      } catch (error) {
        console.error("Error sharing code:", error);
        alert("Error sharing code. Please try again.");
      }
    } else {
      alert("Please enter a valid email and code to share.");
    }
  };

  const runCode = async () => {
    try {
      const response = await axios.post("http://localhost:5002/runCode", {
        code,
        language,
        input: userInput, // Include user input in the request
      });

      if (response.data) {
        setOutput(response.data.output); // Set the output directly to show logs or result
      }
    } catch (error) {
      console.error("Error running code:", error);
      setOutput("Error running code. Please try again.");
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (isLiveSession) {
      socket.emit("codeUpdate", newCode); // Send the updated code to the server only during live session
    }
  };

  const startLiveSession = () => {
    if (!isLiveSession) {
      setIsLiveSession(true);
      socket.emit("joinLiveSession", { email: user.email }); // Notify server to start live session
      setLiveSessionStatus("Live session active");
      alert("Live session started! You are now broadcasting code.");
    } else {
      alert("You are already in a live session.");
    }
  };

  const stopLiveSession = () => {
    if (isLiveSession) {
      socket.emit("stopLiveSession", { email: user.email }); // Notify server to stop live session
      setIsLiveSession(false);
      setLiveSessionStatus("");
      alert("Live session has been stopped.");
    } else {
      alert("You are not in a live session.");
    }
  };

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Code Editor</h1>
      {user ? (
        <>
          {liveSessionStatus && (
            <div className="bg-green-200 text-green-700 p-2 rounded mb-4">
              {liveSessionStatus} for {user.email}
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border p-2"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="c">C</option>
              <option value="c++">C++</option>
              <option value="java">Java</option>
              {/* Add more languages here if needed */}
            </select>
            <button
              onClick={startLiveSession}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Start Live Session
            </button>
            <button
              onClick={stopLiveSession}
              className="bg-red-500 text-white p-2 rounded"
            >
              Stop Live Session
            </button>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="text"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="Email to share code"
              className="border p-2 mr-2 flex-grow"
            />
            <button
              onClick={shareCode}
              className="bg-green-500 text-white p-2 rounded"
            >
              Share Code
            </button>
          </div>

          {/* User input field */}
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Input for the code"
              className="border p-2 mr-2 flex-grow"
            />
          </div>

          <Editor
            height="400px"
            language={language} 
            value={code} // Updated to use controlled component
            onChange={handleCodeChange}
            theme={theme}
          />

          <div className="flex justify-between mt-4">
            <button
              onClick={saveCode}
              className="bg-yellow-500 text-white p-2 rounded"
            >
              Save Code
            </button>
            <button
              onClick={runCode}
              className="bg-red-500 text-white p-2 rounded"
            >
              Run Code
            </button>
          </div>

          <h2 className="text-xl font-bold mt-6">Output</h2>
          <pre className="border p-4">{output}</pre>

          {/* ChatBot Integration */}
          <ChatBot />
        </>
      ) : (
        <p>Please log in to use the code editor.</p>
      )}
    </div>
  );
};

export default Home;