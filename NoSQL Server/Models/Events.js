var mongoose = require('mongoose')
const Schema = mongoose.Schema
const eventSchema = new Schema({
    eventName: {
        type: String
    },
    eventDescription: {
        type: String
    },
    eventDate: {
        type: String
    },
    url: {
        type: String
    },
    owner:{
        type:String
    },
    comments:{
        type:Array
    },
    participants:{
        type:Array
    }
})
const Event = mongoose.model('Event', eventSchema)

module.exports = Event;