import { useState } from 'react'

import './App.css'

function App() {
  const [currentImage, setCurrentImage] = useState(null);
  const [breed, setBreed] = useState(null);
  const [lifeSpan, setLifeSpan] = useState(null);
  const [weight, setWeight] = useState(null);

  const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

  const callAPI = async () => {
    let query = "https://api.thedogapi.com/v1/images/search?size=small&has_breeds=true";
    const response = await fetch(query, {
      headers: {
        "x-api-key": ACCESS_KEY
      }
    });
    const json = await response.json();
    if (json[0]?.url == null) {
      alert("Oops! Something went wrong with that query, let's try again!");
    } else {
      setCurrentImage(json[0].url);
      setBreed(json[0].breeds[0].name);
      setLifeSpan(json[0].breeds[0].life_span);
      setWeight(json[0].breeds[0].weight["imperial"]);
      console.log(json[0]);
    }
  }

  return (
    <>
      <h1>Trippin' on Dogs</h1>
      <div className='info-container'>
        {breed ? (
          <h3>{breed}</h3>
        ) : (
          <h3></h3>
        )}
        {weight ? (
          <h3>{weight} lbs</h3>
        ) : (
          <h3></h3>
        )}
        {lifeSpan ? (
          <h3>{lifeSpan}</h3>
        ) : (
          <h3></h3>
        )}
      </div>
      {currentImage ? (
        <img
          className='screenshot'
          src={currentImage}
          height="400px"
          alt='Screenshot returned'
        />
      ) : (
        <div> </div>
      )}
      <br></br>
      <button type="submit" className="button" onClick={callAPI}>
          Discover!
      </button>
    </>
  )
}

export default App
