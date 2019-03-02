// This gets all of the elements you need from index.html
let ui = {
    timer: document.getElementById('timer'),
    robotStateColor: document.getElementById('robot-state'),
    robotState: document.getElementById('robot-state').firstChild,
    gyro: {
        container: document.getElementById('gyro'),
        val: 0,
        offset: 0,
        visualVal: 0,
        arm: document.getElementById('gyro-arm'),
        number: document.getElementById('gyro-number')
    },
    robotDiagram: {
        arm: document.getElementById('robot-arm'),
        wrist: document.getElementById('robot-wrist'),
        hatchPanel: document.getElementById('robot-hatch-panel'),
        sleigh: document.getElementById('robot-sleigh'),
        cargo: document.getElementById('robot-cargo')
    },
    sensors: {
        hasTarget: document.getElementById('hasTarget'),
        distance: document.getElementById('distance'),
        objectDistance: document.getElementById('object-distance'),
        pressure: document.getElementById('pressure'),
        pressureGauge: document.getElementById('pressure-gauge')
    }
};

// This updates the gyro rotation
let updateGyro = (key, value) => {
    ui.gyro.val = value;
    ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);
    ui.gyro.visualVal %= 360;
    if (ui.gyro.visualVal < 0) {
        ui.gyro.visualVal += 360;
    }
    ui.gyro.arm.style.transform = `rotate(${ui.gyro.visualVal}deg)`;
    ui.gyro.number.innerHTML = ui.gyro.visualVal + 'º';
};

/* These are all your listeners. When the value in the network table is changes, this will run */

// This calls the updateGyro function, passing in the value from the updated gyro position
NetworkTables.addKeyListener('/dashboard/angle', updateGyro);

// This runs when the value from the arm encoder is updated
NetworkTables.addKeyListener('/dashboard/arm', (key, value) => {
    var num = -(Math.floor(value / 50.47) - 635);
    // This constrains the arm between two values
    if (num > 635) {
        num = 635;
    }
    else if (num < -9) {
        num = -9;
    }
    // Calculate visual rotation of arm
    var armAngle = num * 3 / 20 - 45;
    // Rotate the arm in diagram to match real arm
    ui.robotDiagram.arm.style.transform = `rotate(${armAngle}deg)`;
});

// This runs when the value from the sleigh encoder is updated
NetworkTables.addKeyListener('/dashboard/sleigh', (key, value) => {
    // This constrains the sleigh between two values
    if (value > 940) {
        value = 940;
    }
    else if (value < 200) {
        value = 200;
    }
    // Calculate visual rotation of sleigh
    var sleighAngle = value * 3 / 20 - 45;
    // Rotate the sleigh in diagram to match real sleigh
    ui.robotDiagram.sleigh.style.transform = `rotate(${sleighAngle}deg)`;
});

// This runs when the hasTarget value is updated
NetworkTables.addKeyListener('/dashboard/hasTarget', (key, value) => {
    // This sets the color of the hasTarget box to green or red depending on the value of hasTarget
    ui.sensors.hasTarget.style.backgroundColor = value ? 'lime' : 'red';
});

// This runs when the distance value from the ultrasonic sensor is updated
NetworkTables.addKeyListener('/dashboard/distance', (key, value) => {
    // This updates the distance value with the current distance
    ui.sensors.distance.innerHTML = 'Distance: ' + Math.round(value * 100) / 100 + ' ';
    if ((Math.round(value * 100) / 100) <= 19 && (Math.round(value * 100) / 100) > 15) {
        ui.sensors.objectDistance.style.backgroundColor = 'yellow';
    } else if ((Math.round(value * 100) / 100) <= 15) {
        ui.sensors.objectDistance.style.backgroundColor = 'lime';
    } else {
        ui.sensors.objectDistance.style.backgroundColor = 'red';
    }
});

// This runs when the pressure value from the pressure sensor is updated
NetworkTables.addKeyListener('/dashboard/pressure', (key, value) => {
    // This updates the pressure value with the current pressure
    ui.sensors.pressure.innerHTML = 'Pressure: ' + Math.round(value * 100) / 100 + ' ';
    if ((Math.round(value * 100) / 100) < 100 && (Math.round(value * 100) / 100) > 60) {
        ui.sensors.objectDistance.style.backgroundColor = 'yellow';
    } else if ((Math.round(value * 100) / 100) <= 60) {
        ui.sensors.objectDistance.style.backgroundColor = 'red';
    } else {
        ui.sensors.objectDistance.style.backgroundColor = 'lime';
    }
});

// This runs when the value from the limit switch on the hatch is updated
NetworkTables.addKeyListener('/dashboard/hatch-panel', (key, value) => {
    // This shows/hides the hatch-panel element based on the current value of the limit switch
    ui.robotDiagram.hatchPanel.style.display = value ? 'block' : 'none';
});

// This runs when the value from the IR sensor on the cargo
NetworkTables.addKeyListener('/dashboard/robot-cargo', (key, value) => {
    // This shows/hides the cargo element based on the current value of the IR sensor
    ui.robotDiagram.cargo.style.display = value ? 'block' : 'none';
});

// This runs when the wrist piston value is updated
NetworkTables.addKeyListener('/dashboard/wrist', (key, value) => {
    // This rotates the wrist based on the current value of the wrist piston
    ui.robotDiagram.wrist.style.transform = value ? `rotate(${-45})` : `rotate(0deg)`;
});

// This runs when the time left value is updated
NetworkTables.addKeyListener('/dashboard/time', (key, value) => {
    // THis caluclates the minutes/seconds left from the number of seconds that was passed in and displays it
    ui.timer.innerHTML = value < 0 ? '0:00' : Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + Math.floor(value % 60);
});

// This listens for network table errors and displays them
addEventListener('error', (ev) => {
    ipc.send('windowError', { mesg: ev.message, file: ev.filename, lineNumber: ev.lineno })
});
