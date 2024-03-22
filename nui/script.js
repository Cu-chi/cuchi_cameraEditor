const resName = GetParentResourceName();
let rotations = { x: 0, y: 0, z: 0 };
let defaultPositions = { x: 0, y: 0, z: 0 };
let positions = { x: 0, y: 0, z: 0 };
let FOV = 45;
let fovInterval;

window.addEventListener("message", (event) => {
    let data = event.data;
    let camCreatorElem = document.getElementById("container");
    if (data.show) {
        camCreatorElem.style.display = "flex";
        rotations = { x: 0, y: 0, z: 0 };
        defaultPositions = data.pos;
        positions = { ...defaultPositions };
        for (val of ["x", "y", "z"]) {
            document.getElementById("rot-"+val).innerText = rotations[val];
            document.getElementById("pos-"+val).innerText = positions[val];
        }

        document.getElementById("fov").innerText = FOV;
    }
    else {
        camCreatorElem.style.display = "none";
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "Escape" || e.key === "Backspace") {
        fetch("https://"+resName+"/close", {
            method: "POST",
            body: null
        });
    }
})

for (val of ["x", "y", "z"]) {
    let value = val
    let interval;

    let positiveElem = document.getElementById("p-rot-"+value)
    positiveElem.onmousedown = () => {
        interval = setInterval(function() {
            fetch("https://"+resName+"/rotation", {
                method: "POST",
                body: JSON.stringify({
                    axis: value,
                    factor: 1
                })
            });
            rotations[value]++;
            if (rotations[value] % 360 === 0) rotations[value] = 0;
            document.getElementById("rot-"+value).innerText = rotations[value];
        }, 25);
    };

    positiveElem.onmouseup = () => clearInterval(interval);
    positiveElem.onmouseleave = () => clearInterval(interval);

    let negativeElem = document.getElementById("n-rot-"+value)
    negativeElem.onmousedown = () => {
        interval = setInterval(function() {
            fetch("https://"+resName+"/rotation", {
                method: "POST",
                body: JSON.stringify({
                    axis: value,
                    factor: -1
                })
            });
            rotations[value]--;
            if (rotations[value] % 360 === 0) rotations[value] = 0;
            document.getElementById("rot-"+value).innerText = rotations[value];
        }, 25);
    };

    negativeElem.onmouseup = () => clearInterval(interval);
    negativeElem.onmouseleave = () => clearInterval(interval);

    document.getElementById("r-rot-"+value).onclick = () => {
        rotations[value] = 0;
        document.getElementById("rot-"+value).innerText = rotations[value];

        fetch("https://"+resName+"/setRotation", {
            method: "POST",
            body: JSON.stringify({
                axis: value,
                value: 0
            })
        });
    };

    positiveElem = document.getElementById("p-pos-"+value)
    positiveElem.onmousedown = () => {
        interval = setInterval(function() {
            fetch("https://"+resName+"/position", {
                method: "POST",
                body: JSON.stringify({
                    axis: value,
                    factor: 1
                })
            });
            positions[value]++;
            document.getElementById("pos-"+value).innerText = positions[value];
        }, 25);
    };

    positiveElem.onmouseup = () => clearInterval(interval);
    positiveElem.onmouseleave = () => clearInterval(interval);

    negativeElem = document.getElementById("n-pos-"+value);
    negativeElem.onmousedown = () => {
        interval = setInterval(function() {
            fetch("https://"+resName+"/position", {
                method: "POST",
                body: JSON.stringify({
                    axis: value,
                    factor: -1
                })
            });
            positions[value]--;
            document.getElementById("pos-"+value).innerText = positions[value];
        }, 25);
    };

    negativeElem.onmouseup = () => clearInterval(interval);
    negativeElem.onmouseleave = () => clearInterval(interval);

    document.getElementById("r-pos-"+value).onclick = () => {
        positions[value] = defaultPositions[value];
        document.getElementById("pos-"+value).innerText = positions[value]

        fetch("https://"+resName+"/setPosition", {
            method: "POST",
            body: JSON.stringify({
                axis: value,
                value: positions[value]
            })
        });
    };
}

FOVPositiveElem = document.getElementById("p-fov");
FOVPositiveElem.onmousedown = () => {
    fovInterval = setInterval(function() {
        fetch("https://"+resName+"/FOV", {
            method: "POST",
            body: JSON.stringify({
                factor: 1
            })
        });
        FOV++;
        if (FOV > 130) FOV = 130;
        document.getElementById("fov").innerText = FOV;
    }, 25);
};

FOVPositiveElem.onmouseup = () => clearInterval(fovInterval);
FOVPositiveElem.onmouseleave = () => clearInterval(fovInterval);

FOVNegativeElem = document.getElementById("n-fov");
FOVNegativeElem.onmousedown = () => {
    fovInterval = setInterval(function() {
        fetch("https://"+resName+"/FOV", {
            method: "POST",
            body: JSON.stringify({
                factor: -1
            })
        });
        FOV--;
        if (FOV < 0) FOV = 0;
        document.getElementById("fov").innerText = FOV;
    }, 25);
};

FOVNegativeElem.onmouseup = () => clearInterval(fovInterval);
FOVNegativeElem.onmouseleave = () => clearInterval(fovInterval);

document.getElementById("r-fov").onclick = () => {
    document.getElementById("fov").innerText = 45;
    FOV = 45;
    fetch("https://"+resName+"/resetFOV", {
        method: "POST",
        body: null
    });
};

const copyToClipboard = (text) => {
    const element = document.createElement("textarea");
    element.value = text;
    document.body.appendChild(element);
    element.select();
    document.execCommand("copy");
    document.body.removeChild(element);
 };

document.getElementById("copy").onclick = () => {
    copyToClipboard(`CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", ${positions.x}.0, ${positions.y}.0, ${positions.z}.0, ${rotations.x}.0, ${rotations.y}.0, ${rotations.z}.0, ${FOV}.0, true, 2)`);
};
