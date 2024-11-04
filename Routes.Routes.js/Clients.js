const { Router } = require("express");
const { Admin, Client, Coach, Progress, Updating } = require("../momgoose/Model");
const { ClientCreation, update ,ScheduleEmail,ClientDeletion} = require("../InputValidation/Zod");
const mongoose = require("mongoose");
const sendMail = require("../Authorization/mail/mail");
const cron = require("node-cron");
const { clientProgress } = require("../momgoose/Schema");

const route = Router();

async function roleBasedAccess({ email, password }) {
    if (await Admin.find({ email: email, password: password }).length > 0) {
        return true;
    } else if (await Coach.find({ email: email, password: password }).length > 0) {
        return false;
    }
    return null;
}

route.post("/:coachid/client", async (req, res) => {
    try {
        const accessType = await roleBasedAccess(req.headers);

        if (accessType) {
            if (!ClientCreation.safeParse(req.body).success) {
                return res.status(411).json({ msg: "error in input validation" });
            }

            const client = await Client.create({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                age: req.body.age,
                goal: req.body.goal,
                coachId: req.params.coachid,
            });

            if (client) {
                await Progress.create({
                    client: new mongoose.Types.ObjectId(client._id),
                    coach: req.params.coachid,
                });
                await Updating.create({ id: new mongoose.Types.ObjectId(client._id) });
                return res.status(200).json({ msg: "client created" });
            } else {
                return res.status(411).json({ msg: "internal server error" });
            }
        } else {
            const coach = await Coach.findOne({ email: req.headers.email });

            if (!coach || !coach._id.equals(req.params.coachid)) {
                return res.status(411).json({ msg: "coach is not authorized to do this" });
            }

            const client = await Client.create({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                age: req.body.age,
                goal: req.body.goal,
                coachId: coach._id,
            });

            await Progress.create({
                client: client._id,
                coach: req.params.coachid,
            });

            return res.status(200).json({ msg: "client created successfully" });
        }
    } catch (error) {
        console.error("Error creating client:", error);
        return res.status(500).json({ msg: "internal server error" });
    }
});

route.patch("/:id/progress", async (req, res) => {
    const validation = update.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ msg: "Input validation error", errors: validation.error.errors });
    }

    try {
        const coach = await Coach.findOne({ _id: new mongoose.Types.ObjectId(req.headers.id) });
        if (!coach) {
            return res.status(411).json({ msg: "coach not found" });
        }

        const client = await Client.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        if (!client) {
            return res.status(411).json({ msg: "client not found" });
        }

        if (!update.safeParse(req.body).success) {
            return res.status(411).json({ msg: "input invalid found" });
        }

        const updating = await Progress.updateOne(
            { client: new mongoose.Types.ObjectId(req.params.id) },
            {
                progressNotes: req.body.progressNotes,
                lastUpdated: req.body.lastUpdated,
                weight: req.body.weight,
                bmi: req.body.bmi,
            }
        );

        const clientu = await Updating.findOne({ id: new mongoose.Types.ObjectId(req.params.id) });
        await Updating.updateOne(
            { id: new mongoose.Types.ObjectId(req.params.id) },
            {
                weight: req.body.weight - clientu.weight,
                bmi: req.body.bmi - clientu.bmi,
            }
        );

        if (!updating) {
            return res.status(500).json({ msg: "internal server error" });
        }

        return res.status(200).json({ msg: "update successful" });
    } catch (error) {
        console.error("Error updating progress:", error);
        return res.status(500).json({ msg: "internal server error" });
    }
});

route.delete("/:id/delete", async (req, res) => {
    const validation = ClientDeletion.safeParse(req.params);
    if (!validation.success) {
        return res.status(400).json({ 
            msg: "Input validation error", 
            errors: validation.error.errors 
        });}
    try {
        const check = await Admin.find({ email: req.headers.email, password: req.headers.password });
        if (check.length === 0) {
            return res.status(411).json({ msg: "admin not found" });
        }

        const clear = await Client.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
        await Updating.deleteOne({ id: new mongoose.Types.ObjectId(req.params.id) });
        await Progress.deleteOne({ client: new mongoose.Types.ObjectId(req.params.id) });

        if (!clear) {
            return res.status(411).json({ msg: "id not valid" });
        }

        return res.status(200).json({ msg: "deletion completed" });
    } catch (error) {
        console.error("Error deleting client:", error);
        return res.status(500).json({ msg: "internal server error" });
    }
});

route.post("/:id/schedule", async (req, res) => {


    const validation = ScheduleEmail.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ msg: "Input validation error", errors: validation.error.errors });
    }
    try {
        const coach = await Coach.find({ email: req.headers.email, password: req.headers.password });
        if (coach.length === 0) {
            return res.status(411).json({ msg: "Coach not found" });
        }

        const d = req.body.day - 2; 
        const mo = req.body.month;
        const y = req.body.year;

        
        cron.schedule(`* * ${d} ${mo} *`, async () => {
            try {
                const getmail = await sendMail(req.body.mail, req.body.sub, req.body.msg);
                if (getmail) {
                    await Client.updateOne(
                        { _id: mongoose.Types.ObjectId(req.params.id) },
                        { schedule: true }
                    );
                    console.log("Mail sent successfully.");
                } else {
                    console.error("Failed to send mail.");
                }
            } catch (error) {
                console.error("Error in cron job:", error);
            }
        });

       
        return res.status(200).json({ msg: "Cron job scheduled to send mail." });
    } catch (error) {
        console.error("Error scheduling mail:", error);
        return res.status(500).json({ msg: "internal server error" });
    }
});

route.get("/:coachid/filter", async (req, res) => {
    try {
        const valid = await Coach.find({ _id: new mongoose.Types.ObjectId(req.params.coachid) });
        if (valid.length === 0) {
            return res.status(411).json({ msg: "coach id sent wrong" });
        }

        const client = await Client.find({
            $or: [
                {
                    name: { $regex: `^${req.query.filter}`, $options: 'i' }
                }
            ]
        });

        return res.status(200).json({ client });
    } catch (error) {
        console.error("Error filtering clients:", error);
        return res.status(500).json({ msg: "internal server error" });
    }
});

module.exports = route;
