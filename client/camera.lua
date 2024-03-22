local creatingCamera = false
local camera
local rotation
local cameraPosition
local FOV = 45.0

function CreateCamera(coords)
    if not creatingCamera then
        creatingCamera = true

        cameraPosition = {
            x = tonumber(string.format("%.f", coords.x)) + 0.0,
            y = tonumber(string.format("%.f", coords.y)) + 0.0,
            z = tonumber(string.format("%.f", coords.z)) + 0.0
        }

        rotation = {
            x = 0.0,
            y = 0.0,
            z = 0.0
        }

        SendNUIMessage({
            show = true,
            pos = cameraPosition,
            rot = rotation
        })

        SetNuiFocus(true, true)

        while creatingCamera do
            camera = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", cameraPosition.x, cameraPosition.y, cameraPosition.z, rotation.x, rotation.y, rotation.z, FOV, true, 2)
            RenderScriptCams(true, false, 0, false, false)
            SetFocusPosAndVel(cameraPosition.x, cameraPosition.y, cameraPosition.z, 0.0, 0.0, 0.0)

            Wait(0)

            DestroyCam(camera, true)
        end
    else
        creatingCamera = false
        DestroyCam(camera, true)
        RenderScriptCams(false, false, 0, false, false)
        SetFocusEntity(PlayerPedId())
        SendNUIMessage({ show = false, })
        SetNuiFocus(false, false)
    end
end

RegisterCommand("createCam", function()
    local playerPed = PlayerPedId()
    local playerPosition = GetEntityCoords(playerPed)
    CreateCamera(playerPosition)
end, true)

RegisterNUICallback("rotation", function(body, resultCallback)
    if body.axis == "x" then
        rotation.x += body.factor*1
    elseif body.axis == "y" then
        rotation.y += body.factor*1
    elseif body.axis == "z" then
        rotation.z += body.factor*1
    end
    resultCallback("ok")
end)

RegisterNUICallback("setRotation", function(body, resultCallback)
    local value = (tonumber(body.value) or 0.0) + 0.0
    if body.axis == "x" then
        rotation.x = value
    elseif body.axis == "y" then
        rotation.y = value
    elseif body.axis == "z" then
        rotation.z = value
    end
    resultCallback("ok")
end)

RegisterNUICallback("position", function(body, resultCallback)
    cameraPosition[body.axis] += body.factor*1
    resultCallback("ok")
end)

RegisterNUICallback("setPosition", function(body, resultCallback)
    local value = tonumber(body.value) or 0.0
    cameraPosition[body.axis] = value + 0.0
    resultCallback("ok")
end)

RegisterNUICallback("FOV", function(body, resultCallback)
    FOV += body.factor*1
    if FOV < 0 then
        FOV = 0.0
    elseif FOV > 130 then
        FOV = 130.0
    end
    resultCallback("ok")
end)

RegisterNUICallback("resetFOV", function(_, resultCallback)
    FOV = 45.0
    resultCallback("ok")
end)

RegisterNUICallback("close", function(_, resultCallback)
    creatingCamera = false
    DestroyCam(camera, true)
    RenderScriptCams(false, false, 0, false, false)

    SendNUIMessage({ show = false })
    SetNuiFocus(false, false)
    SetFocusEntity(PlayerPedId())

    resultCallback("ok")
end)

AddEventHandler("onResourceStop", function(resource)
    if resource == GetCurrentResourceName() then
        SetFocusEntity(PlayerPedId())
    end
end)
