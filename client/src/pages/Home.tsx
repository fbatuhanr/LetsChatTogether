import Typewriter from 'typewriter-effect'

import HeroImg from "../assets/hero.png"
import HumanImg1 from "../assets/human-1.png"
import StatsImg from "../assets/stats.png"
import PhoneImg from "../assets/phone.png"
import HumanImg2 from "../assets/human-2.png"
import MessageImg from "../assets/message.png"
import poseidonsRealm from "../assets/background/poseidons-realm.png"
import cosmicButterflyLeft from "../assets/background/cosmic-butterfly.png"

import { Link } from 'react-router-dom'
import { useDecodedToken } from '../hooks/useDecodedToken'
import { FaUsers } from 'react-icons/fa'

const Home: React.FC = () => {

    const decodedToken = useDecodedToken()

    return (
        <div>
            <section className="relative max-w-6xl mx-auto flex flex-col md:flex-row pt-4 px-6 md:pt-0 md:px-12">
                <div className="basis-full md:basis-1/2 flex flex-col justify-center md:ps-6 z-20">
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
                    {
                        decodedToken.userId ?
                            <Link to="/users" className="flex items-center justify-center gap-x-2 [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#0D0D0D] w-full md:w-[225px] py-2 text-center mt-8 md:mt-12 border border-[#000000] bg-[#6841F2] rounded-3xl text-2xl font-semibold">
                                Browse Users
                                <FaUsers size={25} className="mt-1" />
                            </Link>
                            :
                            <Link to="/signup" className="[text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#0D0D0D] w-full md:w-[210px] py-2 text-center mt-8 md:mt-12 border border-[#000000] bg-[#6841F2] rounded-3xl text-2xl font-semibold">
                                Join Now
                            </Link>
                    }
                </div>
                <div className="absolute -top-8 p-10 md:relative md:basis-1/2 md:p-8 z-10">
                    <img src={HeroImg} width="100%" height="auto" className="opacity-75 md:opacity-100" />
                </div>

                <div className="absolute top-40 left-0 right-0 md:-top-6 md:right-auto">
                    <img src={poseidonsRealm} className="w-[24rem] md:w-[36rem] md:mx-auto h-auto opacity-20 md:opacity-50" />
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

            <section className="relative mt-32 max-w-6xl px-4 md:px-12 mx-auto py-12 md:py-24 flex justify-center bg-blur-ellipse bg-[length:210px] md:bg-[length:300px] bg-no-repeat md:bg-[center_right_6rem] bg-[center_right_-2em]">
                <div className="basis-full flex justify-center items-center z-10">
                    {
                        decodedToken.userId ?
                            <Link to="/chat" className="[text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#0D0D0D] w-full md:w-3/4 relative py-6 md:py-8 border border-[#0D0D0D] ps-14 md:ps-28 mx-auto bg-[#F2D541] text-2xl md:text-4xl font-bold rounded-full">
                                Start Chatting Now
                                <img src={MessageImg} className="absolute w-32 md:w-44 -top-9 -right-3 md:-top-12 md:-right-8" />
                            </Link>
                            :
                            <Link to="/signup" className="[text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#0D0D0D] w-full md:w-3/4 relative py-6 md:py-8 border border-[#0D0D0D] ps-14 md:ps-28 mx-auto bg-[#F2D541] text-2xl md:text-4xl font-bold rounded-full">
                                Start Free Today
                                <img src={MessageImg} className="absolute w-32 md:w-44 -top-9 -right-3 md:-top-12 md:-right-8" />
                            </Link>
                    }
                </div>
                <div className="absolute -top-32 -left-16 md:-top-48 md:left-0">
                    <img src={cosmicButterflyLeft} className="w-[25rem] md:w-[40rem] h-auto opacity-40 md:opacity-60" />
                </div>
            </section>
        </div>
    )
}

export default Home