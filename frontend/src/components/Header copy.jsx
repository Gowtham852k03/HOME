import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div className='flex flex-col gap-4'>   
            <div className='flex flex-col md:flex-row gap-4 flex-wrap md:flex-nowrap bg-gradient-to-l from-primary-red-start to-primary-red-end rounded-lg px-6 md:px-10 lg:px-20 '>
                {/* --------- Header Left --------- */}
                <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
                    <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
                        Find and Connect with Lifesaving Blood Donors Across India
                    </p>
                    <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                        <p>Access a network of blood donors from across the country with just a few taps. Whether you're in an emergency or planning ahead, our platform makes it easier than ever to search for nearby donors who are ready to help. Trusted, verified, and available when you need it most, we connect you with lifesaving individuals who are committed to giving back. Your health is our priority, and we're here to ensure that blood is always within reach. <br className='hidden sm:block' /> <b>Get Blood Units immediately. Connect to ensure Safety</b></p>
                    </div>
                    <a href='https://thanush-blood-bank.vercel.app/' className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[#595959] text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'>
                        Request Blood Units <img className='w-3' src={assets.arrow_icon} alt="" />
                    </a>
                </div>

                {/* --------- Header Right --------- */}
                <div className='md:w-1/2 flex items-center mb-4'>
                    <img className='w-full  h-fit rounded-lg' src={assets.bloodbank_img} alt="" />
                </div>
            </div> 
            <div className='flex flex-col-reverse md:flex-row-reverse flex-wrap bg-gradient-to-l from-primary-green-start to-primary-green-end rounded-lg px-6 md:px-10 lg:px-20 '>

                {/* --------- Header Left --------- */}
                <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
                    <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
                    Book Trusted Doctors Online Anytime, Anywhere With Ease
                    </p>
                    <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                        <p>Search for nearby blood donors easily. Fast, trusted, and available when you need it most. <br className='hidden sm:block' /> schedule your appointment hassle-free.</p>
                    </div>
                    <a href='#speciality' className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[#595959] text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'>
                        Book appointment <img className='w-3' src={assets.arrow_icon} alt="" />
                    </a>
                </div>

                {/* --------- Header Right --------- */}
                <div className='md:w-1/2 relative mt-4'>
                    <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="" />
                </div>
            </div>
            
        </div>
    )
}

export default Header