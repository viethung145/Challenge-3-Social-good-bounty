import 'regenerator-runtime/runtime'
import React, { useEffect, useState } from 'react'
import { login, logout } from './utils'
import './global.css'
import ukraine from './assets/ukraine.jpeg'
import axios from 'axios'
import { parseNearAmount, formatNearAmount } from 'near-api-js/lib/utils/format';
import moment from 'moment'

export default function App() {

  const [records, setRecords] = useState([])
  const [price, setPrice] = useState(0)
  const [value, setValue] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    window.contract.get_records({ from: "0", limit: 20 }).then(result => setRecords(result))
    axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'near',
        vs_currencies: 'usd'
      }
    }).then(res => {
      setPrice(res.data['near']['usd'])
    })
  }, [])

  console.log(records, price)

  const handleSubmit = () => {
    window.contract.create_record(
      {
        message: message
      },
      300000000000000,
      parseNearAmount(value)
    )
  }

  return (
    <>
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0 flex items-center">
                <img className="block lg:hidden h-8 w-auto" src={ukraine} alt="Donate for Ukrainian" />
                <img className="hidden lg:block h-8 w-auto" src={ukraine} alt="Donate for Ukrainian" />
                <span className='ml-3 text-white font-bold text-xl'>Donate for Ukrainian</span>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {window.walletConnection.isSignedIn() ?
                (
                  <button type="button" className="bg-gray-800 px-4 py-2 font-bold rounded-full text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    Sign out
                  </button>
                ) :
                (
                  <button type="button" className="bg-gray-800 px-4 py-2 font-bold rounded-full text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    Sign in
                  </button>
                )
              }
            </div>
          </div>
        </div>
      </nav>
      <div className='container mx-auto text-center mt-10'>
        <h1 className='text-4xl text-blue-500 font-bold'>Send some NEARs to Ukrainian</h1>
        <input className='text-center font-bold border-none text-gray-800 focus:outline-none input-value' type="number" onChange={(e) => setValue(e.target.value)} placeholder='0' value={value} />
        <div className='text-2xl text-gray-700 font-bold'>≈ {(+value) * price} usd</div>
        <div className='w-2/4 mx-auto flex justify-around mt-5'>
          <div className=''>
            <button className='bg-white px-4 py-2 font-bold round-full text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white' onClick={() => setValue("5")}>5 NEAR</button>
          </div>
          <div className=''>
            <button className='bg-white px-4 py-2 font-bold round-full text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white' onClick={() => setValue("10")}>10 NEAR</button>
          </div>
          <div className=''>
            <button className='bg-white px-4 py-2 font-bold round-full text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white' onClick={() => setValue("20")}>20 NEAR</button>
          </div>
          <div className=''>
            <button className='bg-white px-4 py-2 font-bold round-full text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white' onClick={() => setValue("50")}>50 NEAR</button>
          </div>
        </div>
        <input className='text-center text-2xl font-bold text-gray-800 focus:outline-none mt-3' type="text" onChange={(e) => setMessage(e.target.value)} placeholder='leave a message' />
        <div className="mt-5">
          <button className='w-1/4 bg-blue-800 px-10 py-3 font-bold rounded-full text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white' onClick={handleSubmit}>Donate</button>
        </div>
      </div>
      <div className='mt-4'>
        <div class="p-20">
          <h3 class="text-blue-900 mb-4 text-3xl font-bold text-center">
            PEOPLE DONATED
          </h3>
          {
            records.map(record => {
              return (
                <div class="bg-white p-6 rounded-lg shadow-lg mx-auto mt-3 w-3/4" key={record.id}>
                  <div className='flex justify-between'>
                    <div>
                      <h2 class="text-2xl font-bold mb-2 text-gray-800">{record.sender}</h2>
                      <p class="text-gray-700">{record.message}</p>
                    </div>
                    <div>
                      <p class="text-gray-700">{moment(record.created_at / (10**6)).format('MMMM Do YYYY, h:mm:ss a')}</p>
                      <p class="text-gray-700">{formatNearAmount(record.donated_value)} NEAR</p>
                    </div>
                  </div>
                  
                </div>
              )
            })
          }
          
        </div>
      </div>
    </>
  )
}