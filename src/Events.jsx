import { useEffect, useState } from "react";
import API from "./api";
import CreateEvent from "./CreateEvent";
import { getUserIdFromToken } from "./utils";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const userId = getUserIdFromToken();

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const joinEvent = async (eventId) => {
    try {
      await API.post(`/events/${eventId}/join`);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Join failed");
    }
  };

  const deleteEvent = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/events/${eventId}`);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="container">
      <h1>Events</h1>

      {/* CREATE BUTTON */}
      {!showCreate && !editingEvent && (
        <button
          style={{ marginBottom: "20px" }}
          onClick={() => {
            setShowCreate(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          + Create Event
        </button>
      )}

      {/* CREATE / EDIT FORM */}
      {(showCreate || editingEvent) && (
        <CreateEvent
          editingEvent={editingEvent}
          onCreated={() => {
            setShowCreate(false);
            setEditingEvent(null);
            fetchEvents();
          }}
          onCancel={() => {
            setShowCreate(false);
            setEditingEvent(null);
          }}
        />
      )}

      {/* EVENTS LIST */}
      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events found</p>
      ) : (
        events.map((event) => {
          const isJoined = event.attendees.includes(userId);
          const isFull = event.attendees.length >= event.capacity;
          const isCreator = event.createdBy === userId;

          return (
            <div className="card" key={event._id}>
              {/* IMAGE */}
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt="event"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    marginBottom: "12px",
                    borderRadius: "8px",
                  }}
                />
              )}

              <h3>{event.title}</h3>
              <p>{event.description}</p>

              <p>
                <b>Date:</b>{" "}
                {new Date(event.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <p>
                <b>Location:</b> {event.location}
              </p>

              <p>
                <b>Attendees:</b> {event.attendees.length}/{event.capacity}
              </p>

              {/* JOIN */}
              <button
                disabled={isJoined || isFull}
                onClick={() => joinEvent(event._id)}
              >
                {isJoined ? "Joined" : isFull ? "Event Full" : "Join"}
              </button>

              {/* EDIT / DELETE */}
              {isCreator && (
                <>
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => {
                      setEditingEvent(event);
                      setShowCreate(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="danger"
                    style={{ marginLeft: "10px" }}
                    onClick={() => deleteEvent(event._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Events;
