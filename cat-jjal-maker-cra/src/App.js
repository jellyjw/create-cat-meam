import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Title from "./components/Title";
import Form from "./components/Form";
import MainCard from "./components/MainCard";
import Favorites from "./components/Favorites";

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

// ReactDOM.render로 App컴포넌트가 렌더링
const App = () => {
  const CAT1 = "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";
  const CAT2 = "https://cataas.com/cat/BxqL2EjFmtxDkAm2/says/inflearn";
  const CAT3 = "https://cataas.com/cat/18MD6byVC1yKGpXp/says/JavaScript";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });

  const [mainCat, setMainCat] = React.useState(CAT1);
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || []; //로컬스토리지에 처음 favorites가 없음
  });

  const alreadyFavorite = favorites.includes(mainCat);

  async function setInitialCat() {
    const newCat = await fetchCat("First cat");
    setMainCat(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, []);
  // 맨처음 앱이 생성됐을때만 호출하고 싶을때에는 빈 배열을 넣어줄것.
  // 호출되는 횟수를 관리

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);

    setMainCat(newCat);
    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  const counterCat =
    counter === null ? "고양이 가라사대" : `${counter}번째 고양이 가라사대`;

  return (
    <div>
      <Title>{counterCat}</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard
        alreadyFavorite={alreadyFavorite}
        img={mainCat}
        alt="고양이"
        width="400"
        onHeartClick={handleHeartClick}
      />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
