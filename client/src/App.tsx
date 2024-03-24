import { useEffect, useState } from 'react'
import './App.css'

import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { Events } from './components/Events';
import { ConnectionManager } from './components/ConnectionManager';
import { MyForm } from './components/MyForm';

import Typewriter from 'typewriter-effect';

import HeroImg from "./assets/hero.png"
import HumanImg1 from "./assets/human-1.png"
import StatsImg from "./assets/stats.png"
import PhoneImg from "./assets/phone.png"
import HumanImg2 from "./assets/human-2.png"
import MessageImg from "./assets/message.png"

import EllipseImg from "./assets/ellipse.png"

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
    <div className="bg-[#0D0D0D] min-h-screen w-full h-full text-white font-outfit overflow-x-hidden">
      <header className="bg-gradient-to-b from-[#4F22F2] to-[#0D0D0D1a] h-[140px] md:h-[130px]">
        <div className="max-w-6xl px-12 mx-auto">
          <nav className="flex items-center gap-x-8 py-8">
            <div className="flex-1 text-xl md:text-3xl font-bold">
              <a href="/">Let's Chat Together</a>
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

      <section className="pt-8 px-6 md:pt-0 md:px-12 md:bg-none bg-hero bg-no-repeat bg-[top_right] bg-[length:256px] max-w-6xl mx-auto flex flex-col md:flex-row">
        <div className="basis-full md:basis-1/2 flex flex-col justify-center md:ps-6">
          <h3 className="text-3xl font-thin">
            <Typewriter
              onInit={(typewriter) => {
                typewriter.pauseFor(2500).typeString('Connect and Chat').start();
              }}
            />
          </h3>
          <h1 className="text-4xl md:text-5xl font-semibold mt-4 mb-10">
            <Typewriter 
              options={{
                strings: ['Instant Connections', 'Join the Fun', 'Best Friendship'],
                autoStart: true,
                loop: true
              }}
            />
            with <span className="text-[#F2D541] text-4xl md:text-5xl">Let's Chat Together!</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-light">
            Embark on a journey of connection <br className="hidden md:block" />
            and discovery with Let's Chat Together.
          </h2>
          <button className="md:w-[210px] h-[55px] mt-8 md:mt-12 border border-[#000000] bg-[#6841F2] rounded-3xl text-2xl font-semibold">
            Join Now
          </button>
        </div>
        <div className="hidden md:block md:basis-1/2 p-8">
          <img src={HeroImg} width="100%" height="auto" />
        </div>
      </section>

      <section className="mt-44">
        <div className="bg-gradient-to-r from-[#472DA6] to-[#6841F2]">
          <div className="max-w-6xl px-4 md:px-12 py-12 md:py-16 mx-auto flex relative md:static">
            <div className="basis-1/4 md:relative">
              <img src={HumanImg1} className="absolute w-1/2 md:w-full -left-12 -top-24" />
            </div>
            <div className="basis-3/4 md:basis-2/3 flex flex-col">
              <h2 className="text-4xl md:text-5xl font-bold ps-16 md:ps-12">
                Build New Friendships
              </h2>
              <p className="text-xl md:text-3xl font-light pt-8">
                Let's Chat Together offers you the opportunity to connect with people from all around the globe. Exciting conversations and new friendships await!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-24 md:mt-36 px-12 md:px-24 max-w-6xl mx-auto min-h-96 flex bg-blur-ellipse bg-no-repeat bg-contain">
        <div className="basis-1/2 flex flex-col justify-center">
          <h2 className="text-5xl font-medium leading-snug">Easy to Use <br /> Unlimited Connections</h2>
          <p className="mt-8 mb-2 text-3xl font-light">We offers an accessible interface for everyone.</p>
          <p className="text-3xl font-light text-[#F2D541]">Instant connection, seamless chatting!</p>
        </div>
        <div className="basis-1/2 p-8">
          <img src={StatsImg} width="100%" height="auto" />
        </div>

      </section>

      <section className="mt-48 md:mt-36">
        <div className="flex px-4 md:px-12 py-14 relative bg-gradient-to-tl from-[#4F22F2] to-[#6841F2] rounded-3xl max-w-6xl mx-auto">
          <img src={PhoneImg} className="absolute w-24 md:w-36 left-0 -top-12 md:-top-20" />
          <div className="basis-4/5 md:basis-2/3 flex flex-col gap-y-6 justify-center items-center md:ps-48">
            <h2 className="text-[#F2D541] text-3xl md:text-4xl font-bold">
              Max Entertainment
            </h2>
            <p className="text-2xl md:text-3xl text-center font-medium">
              "We provide the freedom to choose from millions of users with different interests. There's something for everyone!"
            </p>
          </div>
          <div className="basis-1/5 md:basis-1/3">
            <img src={HumanImg2} className="absolute w-1/2 md:w-80 -top-12 -right-12 md:-top-24 md:right-0" />
          </div>
        </div>
      </section>

      <section className="mt-32 max-w-6xl px-4 md:px-12 mx-auto py-12 md:py-24 flex justify-center">
        <div className="basis-full flex justify-center items-center bg-blur-ellipse bg-[length:350px] bg-no-repeat md:bg-[center_left_18rem] bg-[center_center]">
          <button className="w-full md:w-3/4 relative py-6 md:py-8 border border-[#0D0D0D] text-start ps-14 mx-auto bg-[#F2D541] text-2xl md:text-4xl font-bold rounded-full">
            Start Free Today
            <img src={MessageImg} className="absolute w-32 md:w-44 -top-9 -right-3 md:-top-12 md:-right-8" />
          </button>
        </div>
      </section>

      <footer className="mt-32 bg-gradient-to-t from-[#6841F2] to-[#0D0D0D1a] min-h-[200px]">
        <div className="max-w-4xl px-12 mx-auto">

          <nav className="pt-16 pb-8 flex flex-col gap-y-12 md:flex-row md:gap-x-8 justify-between">
            <div>
              <h6 className="mb-6 md:mb-8 text-center md:text-start text-3xl md:text-2xl font-semibold">Let's Chat Together</h6>
              <div className="grid grid-cols-2 grid-rows-2 md:text-start text-center gap-y-4 justify-center md:justify-start">
                <h5 className="text-xl font-bold">Home</h5>
                <h5 className="text-xl font-bold">About</h5>
                <h5 className="text-xl font-bold">Login</h5>
                <h5 className="text-xl font-bold">Sign up</h5>
              </div>
            </div>
            <div>
              <h6 className="mb-4 md:mb-16 text-center md:text-end text-2xl md:text-2xl font-semibold">Join Our Newsletter</h6>
              <div className="relative">
                <input type="text" className="w-full ps-8 pe-24 py-2 rounded-full bg-[#0D0D0D] text-[#BBBBBB]" placeholder="write your email..." />
                <button className="absolute right-0 px-4 py-2 rounded-full bg-[#F2D541]">Submit</button>
              </div>
            </div>
          </nav>

        </div>
      </footer>
    </div>
  )
}

export default App
