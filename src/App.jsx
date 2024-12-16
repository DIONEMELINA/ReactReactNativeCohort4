import { useEffect } from "react";
import { useState } from "react";
import { dataBase } from "./assets/constants";
import './App.css'
function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userLanguage, setUserLanguage] = useState('')
  const [userColor, setUserColor] = useState('');
  const [failedTrail, setFailedTrial] = useState(0);
  const [trails, setTrials] = useState(0);
  const [displayColor, setDisplayColor] = useState("");
  const [displayLanguage, setDisplayLanguage] = useState("");
  const [isMatchFound, setIsMatchFound] = useState(false);
  const [isMatchOver, setIsMatchOver] = useState(false);
  const [success, setSuccess] = useState(0);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [usedLanguageColor, setIsUsedLanguageColor] = useState([]);
  const [arrayOfSuccessAndFailure, setArrayOfSuccessANdFailure] = useState([])
  const [isMatchNotFound, setIsMatchNotFound] = useState(false)
  {/*
  helps us target only when theres no match and button is cicked so we can display the a message when 
  theres no match,couldnt use isMatchFound bcs when the user enter a a language an dcolor already used 
  it will display failed which it shouldnt be so because the user hasnt played yet so this state helps 
  us manipulate only when theres a mismatch 
  */}

  let matchFound = false;

  useEffect(() => {
    setIsLoaded(false)
    setTimeout(() => {
      setIsLoaded(true)

    }, 4000)
  }, [])

  const handleColor = (e) => {
    setUserColor(e.target.value)
  }

  const handleLanguage = (e) => {
    setUserLanguage(e.target.value);
  }

  const handleClick = (e) => {
    e.preventDefault();
    setIsMatchFound(false);
    setIsButtonClicked(true);

    if (failedTrail >= 5 || trails >= 20) {
      setIsMatchOver(true);
    } else {
      setIsMatchOver(false);
      matchFound = false;

      let isUsed = usedLanguageColor.some((data) => {
        return data.color == userColor.toLowerCase() && data.language == userLanguage.toLowerCase();
      });
      if (isUsed) {
        alert(`${userColor} and ${userLanguage} are already in use`);
        return;
      }

      matchFound = dataBase.some((data) => {
        return userColor.toLowerCase() == data.color && userLanguage.toLowerCase() == data.language;
      })

      const status = matchFound

      if (matchFound == true) {
        setDisplayColor(userColor);
        setDisplayLanguage(userLanguage);
        setArrayOfSuccessANdFailure([...arrayOfSuccessAndFailure, { color: userColor, language: userLanguage, status: status }])
        setIsMatchFound(true)
        setIsMatchNotFound(false);
        setIsUsedLanguageColor([...usedLanguageColor, { color: userColor, language: userLanguage }]);
        setSuccess(success + 1);
        setTrials(trails + 1);
      } else {
        setIsMatchFound(false);
        setIsMatchNotFound(true);
        setArrayOfSuccessANdFailure([...arrayOfSuccessAndFailure, { color: userColor, language: userLanguage, status: status }]);
        setFailedTrial((prev) => prev + 1);
        setTrials((prev) => prev + 1);
      }
    }
  }

  useEffect(() => {

    if (isMatchNotFound && isButtonClicked) {
      const audio_failed = new Audio("./../public/audio_failed.unknown");
      audio_failed.currentTime = 0;
      audio_failed.play().catch((error) => {
        console.log(error);
      })
    }
    if (isMatchFound && isButtonClicked) {
      const audio_successful = new Audio("./../public/audio_success.unknown");
      audio_successful.currentTime = 0;
      audio_successful.play().catch((error) => {
        console.log(error)
      })
    }

  }, [isMatchNotFound, isButtonClicked, isMatchFound])

  return (
    <>
      {
        isLoaded ? <>

          {
            isMatchOver ? <>
              <div className="attempt-column">
                <h1>Attempts</h1>
                <div className="attempt-list">
                  {

                    arrayOfSuccessAndFailure.map((data, index) => (
                      <>
                        <div>
                          <p>{index + 1}</p>
                          <p style={{ backgroundColor: `${data.color}` }}>Language: {data.language}</p>
                          {
                            data.status == true ? <><p>Success</p></> : <><p>Failed</p></>
                          }
                        </div>
                      </>
                    ))
                  }
                </div>
              </div>
            </>
              :
              <>
                <div>
                  {
                    isMatchFound && isButtonClicked ? <>
                      <p style={{ backgroundColor: `${displayColor}` }}>{displayLanguage}</p>
                    </> :
                      <>
                        {
                          isMatchNotFound && isButtonClicked ? <>
                            {
                              console.log(arrayOfSuccessAndFailure)
                            }
                            <p>the color {displayColor} does not match the language {displayLanguage}</p>
                          </>
                            :
                            <></>
                        }
                      </>
                  }
                  <form action="">
                    <input type="text" placeholder="Enter Language" onChange={handleLanguage} />
                    <input type="text" placeholder="Enter Color" onChange={handleColor} />
                    {
                      trails <= 20 || failedTrail <= 5 ? <button onClick={handleClick}>Submit</button> :
                        <button onClick={handleClick} disabled="true">Submit</button>
                    }
                  </form>
                </div>
              </>
          }

        </> :
          <>
            <p>Loving the view</p>
            {
              dataBase.map((data, index) => {
                return (
                  <>
                    <p key={index} style={{ backgroundColor: `${data.color}` }}>{data.language}</p>

                  </>
                );
              })
            }
          </>
      }
    </>
  );
}
export default App;