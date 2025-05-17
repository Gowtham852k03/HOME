import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyAppointments = () => {

    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [currentPrescription, setCurrentPrescription] = useState('')

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: "Appointment Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    if (data.success) {
                        navigate('/my-appointments')
                        getUserAppointments()
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const openPrescription = (prescription) => {
        setCurrentPrescription(prescription)
        setShowModal(true)
    }

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div>
            <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>My appointments</p>
            <div className=''>
                {appointments.map((item, index) => (
                    <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
                        <div>
                            <img className='w-36 bg-[#EAEFFF]' src={item.docData.image} alt="" />
                        </div>
                        <div className='flex-1 text-sm text-[#5E5E5E]'>
                            <p className='text-[#262626] text-base font-semibold'>{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className='text-[#464646] font-medium mt-1'>Address:</p>
                            <p>{item.docData.address.line1}</p>
                            <p>{item.docData.address.line2}</p>
                            <p className='mt-1'><span className='text-sm text-[#3C3C3C] font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
                        </div>
                        <div></div>
                        <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                            {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                                <button onClick={() => setPayment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gradient-to-l from-primary-green-start to-primary-green-end hover:text-white transition-all duration-300'>Pay Online</button>
                            )}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                                <>
                                    <button onClick={() => appointmentStripe(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'>
                                        <img className='max-w-20 max-h-5' src={assets.stripe_logo} alt="" />
                                    </button>
                                    <button onClick={() => appointmentRazorpay(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'>
                                        <img className='max-w-20 max-h-5' src={assets.razorpay_logo} alt="" />
                                    </button>
                                </>
                            )}
                            {!item.cancelled && item.payment && !item.isCompleted && (
                                <button className='sm:min-w-48 py-2 border rounded text-[#696969] bg-[#EAEFFF]'>Paid</button>
                            )}
                            {item.isCompleted && (
                                <>
                                    <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>
                                    <button onClick={() => openPrescription(item.prescription)} className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Click to View Prescription</button>
                                </>
                            )}
                            {!item.cancelled && !item.isCompleted && (
                                <button onClick={() => cancelAppointment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>
                            )}
                            {item.cancelled && !item.isCompleted && (
                                <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Prescription Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
                        <h2 className="text-2xl font-bold mb-4">Prescription</h2>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left text-gray-700">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2">Medicine</th>
                                        <th className="px-4 py-2">Morning</th>
                                        <th className="px-4 py-2">Afternoon</th>
                                        <th className="px-4 py-2">Evening</th>
                                        <th className="px-4 py-2">Night</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(
                                        () => {
                                            const medicines = [
                                                { name: "Paracetamol 500mg", morning: 1, afternoon: 0, evening: 1, night: 0 },
                                                { name: "Amoxicillin 250mg", morning: 1, afternoon: 1, evening: 1, night: 1 },
                                                { name: "Ibuprofen 400mg", morning: 0, afternoon: 1, evening: 0, night: 1 },
                                                { name: "Cetirizine 10mg", morning: 0, afternoon: 0, evening: 1, night: 0 },
                                                { name: "Pantoprazole 40mg", morning: 1, afternoon: 0, evening: 0, night: 0 },
                                                { name: "Dolo 650", morning: 1, afternoon: 1, evening: 0, night: 0 },
                                                { name: "Azithromycin 500mg", morning: 0, afternoon: 0, evening: 1, night: 0 },
                                                { name: "Levocetirizine 5mg", morning: 0, afternoon: 0, evening: 1, night: 1 },
                                                { name: "Vitamin C Tablets", morning: 1, afternoon: 0, evening: 1, night: 0 },
                                                { name: "Metformin 500mg", morning: 1, afternoon: 1, evening: 0, night: 1 },
                                                { name: "Atorvastatin 10mg", morning: 0, afternoon: 0, evening: 0, night: 1 },
                                                { name: "Losartan 50mg", morning: 1, afternoon: 0, evening: 0, night: 1 },
                                                { name: "Amlodipine 5mg", morning: 1, afternoon: 0, evening: 1, night: 0 },
                                                { name: "Calcium Tablets", morning: 1, afternoon: 1, evening: 0, night: 0 },
                                                { name: "Rabeprazole 20mg", morning: 1, afternoon: 0, evening: 0, night: 0 },
                                                { name: "Multivitamin Capsules", morning: 1, afternoon: 1, evening: 0, night: 0 },
                                                { name: "Erythromycin 250mg", morning: 1, afternoon: 1, evening: 0, night: 0 },
                                                { name: "Fexofenadine 120mg", morning: 0, afternoon: 0, evening: 1, night: 1 },
                                                { name: "Ranitidine 150mg", morning: 1, afternoon: 0, evening: 0, night: 1 },
                                                { name: "Montelukast 10mg", morning: 0, afternoon: 0, evening: 1, night: 1 },
                                            ];

                                            // Shuffle the medicines randomly
                                            const shuffled = medicines.sort(() => 0.5 - Math.random());
                                            // Pick 2 or 3 random medicines
                                            const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 2);

                                            return selected.map((item, index) => (
                                                <tr key={index} className="border-t">
                                                    <td className="px-4 py-2 font-medium">{item.name}</td>
                                                    <td className="px-4 py-2 text-center">{item.morning}</td>
                                                    <td className="px-4 py-2 text-center">{item.afternoon}</td>
                                                    <td className="px-4 py-2 text-center">{item.evening}</td>
                                                    <td className="px-4 py-2 text-center">{item.night}</td>
                                                </tr>
                                            ));
                                        }
                                    )()}
                                </tbody>
                            </table>
                        </div>

                        <button 
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

        </div>
    )
}

export default MyAppointments
