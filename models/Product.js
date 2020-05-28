const mongoose = require('mongoose');
// validator fja mora preko function da bi radilo this
const validator = function() {
    return this.sifra.toString().length == 7;
};

const ProductSchema = new mongoose.Schema({
    sifra: {
        type: Number,
        required: [true, 'Please add a product code'],
        validate: [validator, 'Sifra mora da sadrzi 7 broja'],
        //validate: [function() {return this.sifra.toString().length == 7}, 'Sifra mora da sadrzi 7 broja'],
        unique: true        
    },

    proizvod: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
        minlength: [2, 'Name can not be less than 2 characters'],
        maxlength: [45, 'Name can not be more than 45 characters']
    },

    napon: {
        type: String,
        required: [true, 'Please add a rated voltage'],
        enum: ['300/300V', '300/500V', '380V', '450/750V', '0.6/1kV', '3.6/6kV', '6/10kV', '12/20kV', '20/35kV', 'N/A']
    },

    boja: {
        type: String,
        required: [true, 'Please add a product color'],
        enum: ['CRNA', 'SIVA', 'BELA', 'CRVENA', 'NARANDŽASTA','ŽUTA', 'ZELENA', 'ŽUTO-ZELENA', 'PLAVA','BRAON', 'N/A', 'BEZBOJNA'],
        uppercase: true
        
    },

    propis: {
        type: String,
        required: [true, 'Please add a product standard'],
        trim: true,
        maxlength: [40, 'Max length for standard name is 40 characters'],
        uppercase: true
    },

    brojZica: {
        type: Number,
        required: [true, 'Please add a number of component wires'],
        min: [1, 'Min number of component wires is 1']
        //max: [60, 'Max number of component wires is 60']
    },

    precnikZice: {
        type: mongoose.Types.Decimal128,
        required: [true, 'Please add a diametar of component wires'],
        min: [0.2, 'Min diametar of component wire is 0.2'],
        max: [3.6, 'Max diametar of component wire is 3.6']
    },

    otpor: {
        type: mongoose.Types.Decimal128,
        required: [true, 'Please add a resistance'],
        min: [0.01, 'Min resistance is 0.1'],
        max: [24, 'Max resistance is 24']
    },

    debIzolacije: {
        type: mongoose.Types.Decimal128,
        required: [true, 'Please add a insulation thickness'],
        //min: [0.3, 'Min insulation thickness is 0.3'],
        max: [9, 'Max insulation thickness is 9']
    },

    debPPS1: {
        type: String,
        trim: true,
        default: "/"
    },

    debPPS2: {
        type: String,
        trim: true,
        default: "/"
    },

    debPlasta: {
        type: mongoose.Types.Decimal128,
        required: [true, 'Please add a sheath thickness'],
        min: [0.3, 'Min sheath thickness is 0.3'],
        max: [4, 'Max sheath thickness is 4']
    },

    spPrecnik: {
        type: mongoose.Types.Decimal128,
        required: [true, 'Please add a overall diametar'],
        min: [2, 'Min overall diametar is 2'],
        max: [70, 'Max overall diametar is 70']
    },

    ispitniNapon: {
        type: Number,
        required: [true, 'Please add a test voltage'],
        //enum: ['2kV', '2.5kV', '3kV', '3.5kV', '4kV', '15kV', '21kV', '30kV', '42kV', '50kV', '83.2kV']
        enum: [0, 2, 2.5, 3, 3.5, 4, 15, 21, 30, 42, 50, 83.2]
    },

    parcijalna: {
        type: String,
        trim: true,
        default: "/"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);