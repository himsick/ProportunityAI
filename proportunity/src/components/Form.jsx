import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import { Fragment, useEffect, useRef, useState } from "react";

 
const TerminalContact = () => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
 
  return (
    <section
      id="Form"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1619252584172-a83a949b6efd?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTV8fHxlbnwwfHx8fHw%3D)",
        backgroundSize: "cover",
        backgroundPosition: "center calc(100% + 130px)",
      }}
      className="px-4 py-12 bg-violet-600"
    >
      <div
        ref={containerRef}
        onClick={() => {
          inputRef.current?.focus();
        }}
        className="h-96 bg-slate-950/70 backdrop-blur rounded-lg w-full max-w-3xl mx-auto overflow-y-scroll shadow-xl cursor-text font-mono"
      >
        <TerminalHeader />
        <TerminalBody inputRef={inputRef} containerRef={containerRef} />
      </div>
    </section>
  );
};
 
const TerminalHeader = () => {
  return (
    <div className="w-full p-3 bg-slate-900 flex items-center gap-1 sticky top-0">
      <div className="w-3 h-3 rounded-full bg-red-500" />
      <div className="w-3 h-3 rounded-full bg-yellow-500" />
      <div className="w-3 h-3 rounded-full bg-green-500" />
      <span className="text-sm text-slate-200 font-semibold absolute left-[50%] -translate-x-[50%]">
        Proportunity Form
      </span>
    </div>
  );
};
 
const TerminalBody = ({ containerRef, inputRef }) => {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState("");
 
  const [questions, setQuestions] = useState(QUESTIONS);
 
  const curQuestion = questions.find((q) => !q.complete);
 
  const handleSubmitLine = (value) => {
    if (curQuestion) {
      setQuestions((pv) =>
        pv.map((q) => {
          if (q.key === curQuestion.key) {
            return {
              ...q,
              complete: true,
              value,
            };
          }
          return q;
        })
      );
    }
  };
 
  return (
    <div className="p-2 text-slate-100 text-lg">
      <InitialText />
      <PreviousQuestions questions={questions} />
      <CurrentQuestion curQuestion={curQuestion} />
      {curQuestion ? (
        <CurLine
          text={text}
          focused={focused}
          setText={setText}
          setFocused={setFocused}
          inputRef={inputRef}
          command={curQuestion?.key || ""}
          handleSubmitLine={handleSubmitLine}
          containerRef={containerRef}
        />
      ) : (
        <Summary questions={questions} setQuestions={setQuestions} />
      )}
    </div>
  );
};
 
const InitialText = () => {
  return (
    <>
      <p>Hey there! Tell us more about yourself.</p>
      <p className="whitespace-nowrap overflow-hidden font-light">
        ------------------------------------------------------------------------
      </p>
    </>
  );
};
 
const PreviousQuestions = ({ questions }) => {
  return (
    <>
      {questions.map((q, i) => {
        if (q.complete) {
          return (
            <Fragment key={i}>
              <p>
                {q.text || ""}
                {q.postfix && (
                  <span className="text-violet-300">{q.postfix}</span>
                )}
              </p>
              <p className="text-emerald-300">
                <FiCheckCircle className="inline-block mr-2" />
                <span>{q.value}</span>
              </p>
            </Fragment>
          );
        }
        return <Fragment key={i}></Fragment>;
      })}
    </>
  );
};
 
const CurrentQuestion = ({ curQuestion }) => {
  if (!curQuestion) return <></>;
 
  return (
    <p>
      {curQuestion.text || ""}
      {curQuestion.postfix && (
        <span className="text-violet-300">{curQuestion.postfix}</span>
      )}
    </p>
  );
};
 
const Summary = ({ questions, setQuestions }) => {
  const [complete, setComplete] = useState(false);
 
  const handleReset = () => {
    setQuestions((pv) => pv.map((q) => ({ ...q, value: "", complete: false })));
  };
 
  const handleSend = () => {
    const formData = questions.reduce((acc, val) => {
      return { ...acc, [val.key]: val.value };
    }, {});
  
    // Send this data to the Flask server for assessment
    fetch("http://127.0.0.1:5173/assess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
      console.log("Eligibility Response:", data);
      // Now you have your eligibility response. You can do something with it.
      // For example, set it in the state and display it in your component.
      
      alert(JSON.stringify(data, null, 2)); // This will show the data in a simple alert dialog box.
      
      
      setComplete(true);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };
 
  return (
    <>
      <p>Beautiful! Here's what we've got:</p>
      {questions.map((q) => {
        return (
          <p key={q.key}>
            <span className="text-blue-300">{q.key}:</span> {q.value}
          </p>
        );
      })}
      <p>Look good?</p>
      {complete ? (
        <p className="text-emerald-300">
          <FiCheckCircle className="inline-block mr-2" />
          <span>Sent!</span>
        </p>
      ) : (
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleReset}
            className="px-3 py-1 text-base hover:opacity-90 transition-opacity rounded bg-slate-100 text-black"
          >
            Restart
          </button>
          <button
            onClick={handleSend}
            className="px-3 py-1 text-base hover:opacity-90 transition-opacity rounded bg-indigo-500 text-white"
          >
            Send it!
          </button>
        </div>
      )}
    </>
  );
};
 
const CurLine = ({
  text,
  focused,
  setText,
  setFocused,
  inputRef,
  command,
  handleSubmitLine,
  containerRef,
}) => {
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };
 
  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmitLine(text);
    setText("");
    setTimeout(() => {
      scrollToBottom();
    }, 0);
  };
 
  const onChange = (e) => {
    setText(e.target.value);
    scrollToBottom();
  };
 
  useEffect(() => {
    return () => setFocused(false);
  }, []);
 
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          onChange={onChange}
          value={text}
          type="text"
          className="sr-only"
          autoComplete="off"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </form>
      <p>
        <span className="text-emerald-400">➜</span>{" "}
        <span className="text-cyan-300">~</span>{" "}
        {command && <span className="opacity-50">Enter {command}: </span>}
        {text}
        {focused && (
          <motion.span
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear",
              times: [0, 0.5, 0.5, 1],
            }}
            className="inline-block w-2 h-5 bg-slate-400 translate-y-1 ml-0.5"
          />
        )}
      </p>
    </>
  );
};
 
export default TerminalContact;
 
const QUESTIONS = [
  {
    key: "creditScore",
    text: "To get started, could you share your ",
    postfix: "credit score?",
    complete: false,
    value: "",
  },
  {
    key: "loanAmount",
    text: "Great! Now what's the ",
    postfix: "amount of loan you're seeking?",
    complete: false,
    value: "",
  },
  {
    key: "appraisedValue",
    text: "Thanks! And what's the ",
    postfix: "appraised value of the property?",
    complete: false,
    value: "",
  },
  {
    key: "grossMonthlyIncome",
    text: "Next, what's your ",
    postfix: "gross monthly income?",
    complete: false,
    value: "",
  },
  {
    key: "totalMonthlyPayments",
    text: "Alright, and your ",
    postfix: "total monthly payments for debts like car payments, credit cards, student loans?",
    complete: false,
    value: "",
  },
  {
    key: "monthlyMortgagePayment",
    text: "Lastly, what would be your ",
    postfix: "estimated monthly mortgage payment?",
    complete: false,
    value: "",
  },
];
 