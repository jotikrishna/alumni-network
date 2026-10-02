const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name email company jobTitle profileImage')
      .sort({ date: 1, createdAt: -1 });

    return res.json(events);
  } catch (error) {
    console.error('getEvents Error:', error);
    return res.status(500).json({ message: 'Error fetching events' });
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email company jobTitle profileImage');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.json(event);
  } catch (error) {
    console.error('getEventById Error:', error);
    return res.status(500).json({ message: 'Error fetching event details' });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const { title, date, time, location, description } = req.body;

    if (!title || !date || !time || !location || !description) {
      return res.status(400).json({ message: 'Please provide all event fields: title, date, time, location, description' });
    }

    const event = await Event.create({
      title,
      date,
      time,
      location,
      description,
      createdBy: req.user._id
    });

    const populatedEvent = await Event.findById(event._id).populate('createdBy', 'name email company jobTitle profileImage');

    return res.status(201).json({
      message: 'Event created successfully',
      event: populatedEvent
    });
  } catch (error) {
    console.error('createEvent Error:', error);
    return res.status(500).json({ message: error.message || 'Error creating event' });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this event' });
    }

    const { title, date, time, location, description } = req.body;

    if (title) event.title = title;
    if (date) event.date = date;
    if (time) event.time = time;
    if (location) event.location = location;
    if (description) event.description = description;

    const updatedEvent = await event.save();
    const populatedEvent = await Event.findById(updatedEvent._id).populate('createdBy', 'name email company jobTitle profileImage');

    return res.json({
      message: 'Event updated successfully',
      event: populatedEvent
    });
  } catch (error) {
    console.error('updateEvent Error:', error);
    return res.status(500).json({ message: 'Error updating event' });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();

    return res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('deleteEvent Error:', error);
    return res.status(500).json({ message: 'Error deleting event' });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
