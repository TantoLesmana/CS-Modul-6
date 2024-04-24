require('dotenv').config()
const { Pool } = require("pg");
const tableName = "history";
const pool = new Pool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    database: process.env.DATABASE,
});
pool.connect().then(() => {
    console.log("Connected to PostgreSQL database");
});
async function addEvent(req, res) {
    const { title, description, year, period, month, day, country, city } =
        req.body;
    try {
        const result = await pool.query(
            'INSERT INTO history (title, description, year, period, month, day, country, city) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING* ',
            [title, description, year, period, month, day, country, city]
);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getAllEvents(req, res) {
    try {
        const result = await pool.query('select * from history');
        const events = result.rows;
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function updateEvent(req, res) {
    const eventId = req.params.id;
    const { title, description, year, period, month, day, country, city } =
        req.body;
    try {
        const result = await pool.query(
            `UPDATE history set title = $1, description = $2, year = $3,
    period = $4, month = $5, day = $6, country = $7, city = $8 where id = $9
    returning *`,
            [title, description, year, period, month, day, country, city,
                eventId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Event not found" });
        }
        const updatedEvent = result.rows[0];
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
async function deleteEvent(req, res) {
    const eventId = req.params.id;
    try {
        const result = await pool.query(`delete from history where id =
    $1 returning *`, [eventId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getCountryEvent(req, res) {
    const {country} = req.params;
    try {
        const result = await pool.query('SELECT * FROM history WHERE country = $1', [country]);
        if (result.rowCount === 0) {
            return res.status(044).json({ error: "Event not found" });
        }
        const events = result.rows;
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getPaginateEvent(req, res) {
    const {page, pageSize} = req.params.id;
    try {
        const offset = (parseInt(page) - 1) * parseInt(pageSize);
        const result = await pool.query('SELECT * FROM history LIMIT $1 OFFSET $2', [parseInt(pageSize), offset]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Event not found" });
        }
        const events = result.rows;
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    addEvent,
    getAllEvents,
    updateEvent,
    deleteEvent,
    getCountryEvent,
    getPaginateEvent
};