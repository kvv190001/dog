import { useState } from 'react'

import './App.css'

function App() {
  const [currentImage, setCurrentImage] = useState(null);
  const [breed, setBreed] = useState(null);
  const [lifeSpan, setLifeSpan] = useState(null);
  const [weight, setWeight] = useState(null);

  const [banList, setBanList] = useState(new Set());

  const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

  const isBanned = (value) => banList.has(value);

  const addToBanList = (value) => {
    setBanList(prev => {
      const updated = new Set(prev);
      updated.add(value);
      console.log(updated);
      return updated;
    });
  }

  const removeFromBanList = (value) => {
    setBanList(prev => {
      const updated = new Set(prev);
      updated.delete(value);
      return updated;
    });
  }

  const callAPI = async () => {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      let query = "https://api.thedogapi.com/v1/images/search?size=small&has_breeds=true";
      const response = await fetch(query, {
        headers: {
          "x-api-key": ACCESS_KEY
        }
      });
      const json = await response.json();
      if (json[0]?.url == null) {
        alert("Oops! Something went wrong with that query, let's try again!");
        return;
      }

      const breedName = json[0].breeds[0].name;
      const breedLifeSpan = json[0].breeds[0].life_span;
      const breedWeight = json[0].breeds[0].weight["imperial"];

      if (
        isBanned(breedName) ||
        isBanned(breedLifeSpan) ||
        isBanned(breedWeight)
      ) {
        attempts++;
        continue;
      }

      setCurrentImage(json[0].url);
      setBreed(breedName);
      setLifeSpan(breedLifeSpan);
      setWeight(breedWeight);
      return;
    }

    alert("Couldn't find a dog matches your filters")
  }

  const handleAttributeClick = (value) => {
    if (isBanned(value)) return;
    addToBanList(value);
  };

  const handleBanClick = (value) => {
    removeFromBanList(value);
  }

  return (
    <div className='layout'>
      <div>
        <h1>Trippin' on Dogs</h1>
        <div className='info-container'>
          {breed ? (
            <h3 className='clickable' onClick={() =>handleAttributeClick(breed)}>{breed}</h3>
          ) : (
            <h3></h3>
          )}
          {weight ? (
            <h3 className='clickable' onClick={() =>handleAttributeClick(weight)}>{weight} lbs</h3>
          ) : (
            <h3></h3>
          )}
          {lifeSpan ? (
            <h3 className='clickable' onClick={() =>handleAttributeClick(lifeSpan)}>{lifeSpan}</h3>
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
      </div>
      <div className='ban-list'>
        <h2>Ban List</h2>
        {[...banList].length === 0 ? (
          <p className='empty'>None</p>
        ) : (
          [...banList].map(value => (
            <span 
              key={value}
              className='ban-item'
              onClick={() => handleBanClick(value)}
            >
              {value}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

export default App
