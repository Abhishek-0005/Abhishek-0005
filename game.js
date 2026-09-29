// Nitro Boost Feature

let isNitroActive = false;
let nitroCooldown = false;
let nitroDuration = 3000; // 3 seconds
let nitroCooldownDuration = 5000; // 5 seconds

function activateNitro() {
    if (!nitroCooldown) {
        isNitroActive = true;
        console.log('Nitro activated!');
        setTimeout(() => {
            isNitroActive = false;
            nitroCooldown = true;
            console.log('Nitro deactivated! Cooldown started.');

            setTimeout(() => {
                nitroCooldown = false;
                console.log('Nitro cooldown over. Ready to activate again!');
            }, nitroCooldownDuration);
        }, nitroDuration);
    } else {
        console.log('Nitro is on cooldown!');
    }
}

// Event listener for the Nitro button
document.getElementById('nitro-button').addEventListener('click', activateNitro);

// Update game loop to check if Nitro is active
function gameLoop() {
    if (isNitroActive) {
        // Increase car speed
        car.speed *= 2; // Double the speed
    }
    // Other game logic...
}

setInterval(gameLoop, 100); // Run game loop every 100ms
