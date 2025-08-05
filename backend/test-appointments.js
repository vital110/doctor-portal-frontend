const { Patient, Appointment } = require('./models');

async function testAppointments() {
    try {
        const appointments = await Appointment.findAll({
            include: [{
                model: Patient,
                attributes: ['name', 'phone']
            }],
            order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
        });
        
        console.log('Found appointments:', appointments.length);
        appointments.forEach(apt => {
            console.log(`Token #${apt.tokenNumber} - ${apt.Patient.name} - ${apt.Patient.phone} - ${apt.status}`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

testAppointments();