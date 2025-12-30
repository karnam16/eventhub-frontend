import { useEffect, useState } from "react";
import API from "./api";

function CreateEvent({ onCreated, editingEvent, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ PREFILL FORM WHEN EDITING
  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description);
      setDate(editingEvent.date.split("T")[0]);
      setLocation(editingEvent.location);
      setCapacity(editingEvent.capacity);
      setImage(null); // optional new image
    }
  }, [editingEvent]);

  const handleSubmit = async () => {
    if (!title || !description || !date || !location || !capacity) {
      alert("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("location", location);
    formData.append("capacity", capacity);

    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);

      if (editingEvent) {
        // ✅ UPDATE
        await API.put(`/events/${editingEvent._id}`, formData);
        alert("Event updated successfully");
      } else {
        // ✅ CREATE
        if (!image) {
          alert("Image is required");
          return;
        }
        await API.post("/events", formData);
        alert("Event created successfully");
      }

      // RESET FORM
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setCapacity("");
      setImage(null);

      onCreated();
      onCancelEdit && onCancelEdit();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: "30px" }}>
      <h2>{editingEvent ? "Edit Event" : "Create Event"}</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br /><br />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <br /><br />

      <input
        type="number"
        placeholder="Capacity"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />
      <br /><br />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <br /><br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading
          ? "Saving..."
          : editingEvent
          ? "Update Event"
          : "Create Event"}
      </button>

      {editingEvent && (
        <button
          style={{ marginLeft: "10px" }}
          onClick={onCancelEdit}
        >
          Cancel
        </button>
      )}
    </div>
  );
}

export default CreateEvent;
