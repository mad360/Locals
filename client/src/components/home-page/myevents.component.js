import { useEffect, useState } from 'react'
import './home-page.css'

//components
import Modal from 'react-modal';
import EventCard from "./eventcard.component"
import CreateEditEventForm from "./createEditEventForm.component"
import Table from "./table.png"

const axios = require("axios")

export default function MyEvents(props) {
    const { username } = props

    const [events, setEvents] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    //retrieve the events upon mount
    useEffect(() => {
        let query = { host: `${username}` }
        axios.get("/api/events", { params: query }).then(res => {
            setEvents(res.data)
        })
    }, [username])
    // used by child components to signal that there has been a change
    function updateEvents(){
        let query = { host: `${username}` }
        axios.get("/api/events", { params: query }).then(res => {
            setEvents(res.data)
        })
    }

    return (
        <div>
            <div className="ImageHeader">
                <img className="Banner" src={Table}/>
                <div className="HeaderObject">
                    <h1 className="MyEventHeader">My Events</h1>
                </div>
            </div>
            <div className="CenterDiv">
                <button className="AddEventButton" onClick={() => { setIsModalOpen(true) }}>Add Event</button>
            </div>
            <Modal ariaHideApp={false} isOpen={isModalOpen}>
                <CreateEditEventForm username={username} setIsModalOpen={setIsModalOpen} updateEvents={updateEvents} />
            </Modal>
            <ul>
                {
                    events.map((event, idx) =>
                        <li key={idx}>
                            <EventCard key={idx} username={username} event={event} updateEvents={updateEvents} />
                        </li>
                    )
                }
            </ul>
        </div>
    )
}