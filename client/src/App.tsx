import { useEffect, useState } from 'react'
import './App.css'

import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { Events } from './components/Events';
import { ConnectionManager } from './components/ConnectionManager';
import { MyForm } from './components/MyForm';

import HeroImg from "./assets/hero.png"
import HumanImg1 from "./assets/human-1.png"
import StatsImg from "./assets/stats.png"

function App() {

  const [isConnected, setIsConnected] = useState<any>(socket.connected);
  const [fooEvents, setFooEvents] = useState<any>([]);

  useEffect(() => {

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value: any) {
      setFooEvents((previous: any) => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

  /*return (

    <div className="App">
      <ConnectionState isConnected={isConnected} />
      <Events events={fooEvents} />
      <ConnectionManager />
      <MyForm />
    </div>
  )
  */

  return (
    <div className="bg-[#0D0D0D] min-h-screen h-full text-white">
      <header className="bg-gradient-to-b from-[#4F22F2] to-[#0D0D0D1a] h-[130px] font-outfit">

        <div className="max-w-7xl mx-auto">

          <nav className="flex gap-x-8 py-8">

            <div className="flex-1 text-3xl font-bold">
              <a href="/">Let’s Chat Together</a>
            </div>
            <div className="text-2xl font-semibold">
              <a href="/">Login</a>
            </div>
            <div className="text-2xl font-semibold">
              <a href="/">Sign up</a>
            </div>
          </nav>

        </div>
      </header>

      <section className="max-w-7xl mx-auto flex">

        <div className="basis-1/2 flex flex-col justify-center ps-6">
          <h3 className="text-3xl font-light">Connect and Chat</h3>
          <h1 className="text-5xl font-semibold mt-3 mb-6">
            Instant Connections <br />
            with <span className="text-[#F2D541]">Let's Chat Together!</span>
          </h1>
          <h2 className="text-2xl font-light">
            Embark on a journey of connection <br />
            and discovery with Let's Chat Together.
          </h2>

          <button className="w-[210px] h-[55px] mt-12 bg-[#6841F2] rounded-3xl text-2xl font-semibold">
            Join Now
          </button>
        </div>
        <div className="basis-1/2 p-8">
          <img src={HeroImg} width="100%" height="auto" />
        </div>

      </section>


      <section className="my-20">
        <div className="bg-gradient-to-r from-[#472DA6] to-[#6841F2]">
          <div className="max-w-7xl mx-auto flex min-h-96">
            <div className="basis-1/3 relative">
              <img src={HumanImg1} className="absolute -top-24" />
            </div>
            <div className="basis-2/3 flex flex-col justify-center font-outfit">
              <h2 className="text-5xl font-bold ps-12">
                Build New Friendships
              </h2>
              <p className="text-3xl py-10">
                Let's Chat Together offers you the opportunity to connect with people from all around the globe. Exciting conversations and new friendships await!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto min-h-96 flex px-24">
        <div className="basis-1/2 flex flex-col justify-center">
          <h2 className="text-5xl font-medium leading-snug">Easy to Use <br /> Unlimited Connections</h2>
          <p className="mt-8 mb-2 text-2xl font-light">We offers an accessible interface for everyone.</p>
          <p className="text-2xl font-light text-[#F2D541]">Instant connection, seamless chatting!</p>
        </div>
        <div className="basis-1/2 p-8">
          <img src={StatsImg} width="100%" height="auto" />
        </div>
      </section>
    </div>
  )
}

export default App
