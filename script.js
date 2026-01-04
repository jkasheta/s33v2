// Terminal state
let currentState = 'boot';
let bootSequenceIndex = 0;
let currentLine = '';
let charIndex = 0;
let terminalElement;

// Boot sequence lines
const bootSequence = [
    'SECTOR THIRTY THREE - MOBILE TERMINAL',
    '====================',
    'WELCOME TO S33 NETWORK',
    'ESTABLISHING SECURE CONNECTION...',
    'LOADING S33 PROTOCOLS...',
    'ACCESS GRANTED.',
    ' ',
    '',
    '',
    ''
];

// Menu options
const menuOptions = [
    '[1] MISSION BRIEF',
    '[2] SERVICES',
    '[3] INTEL',
    '[4] CONTACT'
];

// Content for each section
const content = {
    '1': {
        title: 'MISSION BRIEF',
        text: '"SECTOR THIRTY THREE is a production studio founded by Jake Kasheta, focused on tightly built, highly technical live experiences. Jake\'s background spans global touring, pop-ups, and large-scale brand activations. Recent work includes leading production for Justin Bieber\'s SKLYRK Tokyo pop-up, integrating creative, logistics, and on-site execution into one streamlined operation. The studio plugs into artists, brands, and teams that need a deeply hands-on partner from first sketch to doors open."'
    },
    '2': {
        title: 'SERVICES',
        text: 'PRODUCTION DIRECTION\nPOP-UP & TOURING SYSTEMS\nTECHNICAL ADVANCE & SHOW CALLING\nGLOBAL LOGISTICS & GROUND SUPPORT'
    },
    '3': {
        title: 'INTEL',
        requiresPassword: true,
        password: 'S33ACCESS',
        text: 'INTEL ONLINE // INTERNAL NOTES AND BUILD LOGS COMING SOON'
    },
    '4': {
        title: 'CONTACT',
        text: 'CONTACT: ops@sectorthirtythree.com'
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    terminalElement = document.getElementById('terminal');
    startBootSequence();
});

// Boot sequence animation
function startBootSequence() {
    if (bootSequenceIndex < bootSequence.length) {
        currentLine = bootSequence[bootSequenceIndex];
        charIndex = 0;
        typeLine();
    } else {
        showMenu();
    }
}

function typeLine() {
    if (charIndex < currentLine.length) {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'terminal-line';
        lineDiv.textContent = currentLine.substring(0, charIndex + 1);
        
        // Replace last line in terminal
        const lines = terminalElement.querySelectorAll('.terminal-line');
        if (lines.length > bootSequenceIndex) {
            terminalElement.removeChild(lines[bootSequenceIndex]);
        }
        terminalElement.appendChild(lineDiv);
        
        charIndex++;
        setTimeout(typeLine, 30);
    } else {
        bootSequenceIndex++;
        setTimeout(startBootSequence, 200);
    }
}

// Show main menu
function showMenu() {
    currentState = 'menu';
    
    // Add menu options
    menuOptions.forEach((option, index) => {
        const menuDiv = document.createElement('div');
        menuDiv.className = 'terminal-line clickable';
        menuDiv.textContent = option;
        menuDiv.setAttribute('data-option', String(index + 1));
        menuDiv.addEventListener('click', () => handleMenuClick(String(index + 1)));
        terminalElement.appendChild(menuDiv);
    });
    
    // Add blank line and cursor
    addBlankLine();
    addCursorLine();
    
    // Add keyboard listener
    document.addEventListener('keydown', handleKeyPress);
}

// Add blank line
function addBlankLine() {
    const blankDiv = document.createElement('div');
    blankDiv.className = 'terminal-line';
    blankDiv.innerHTML = '&nbsp;';
    terminalElement.appendChild(blankDiv);
}

// Add cursor line
function addCursorLine() {
    const cursorDiv = document.createElement('div');
    cursorDiv.className = 'terminal-line';
    cursorDiv.id = 'cursor-line';
    cursorDiv.innerHTML = '> <span class="cursor"></span>';
    terminalElement.appendChild(cursorDiv);
}

// Handle keyboard input
function handleKeyPress(event) {
    if (currentState === 'menu') {
        const key = event.key;
        if (['1', '2', '3', '4'].includes(key)) {
            handleMenuClick(key);
        }
    }
}

// Handle menu selection
function handleMenuClick(option) {
    const section = content[option];
    
    if (section.requiresPassword && currentState !== 'authenticated') {
        showPasswordPrompt(option);
    } else {
        showContent(option);
    }
}

// Show password prompt
function showPasswordPrompt(option) {
    currentState = 'password';
    
    // Clear terminal
    terminalElement.innerHTML = '';
    
    // Show prompt
    const promptDiv = document.createElement('div');
    promptDiv.className = 'terminal-line';
    promptDiv.textContent = 'ENTER ACCESS CODE:';
    terminalElement.appendChild(promptDiv);
    
    addBlankLine();
    
    // Create input
    const inputDiv = document.createElement('div');
    inputDiv.className = 'terminal-line';
    const input = document.createElement('input');
    input.type = 'password';
    input.id = 'password-input';
    input.placeholder = 'PASSWORD';
    inputDiv.appendChild(document.createTextNode('> '));
    inputDiv.appendChild(input);
    terminalElement.appendChild(inputDiv);
    
    input.focus();
    
    // Handle password submission
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.stopPropagation();
            event.preventDefault();
            const enteredPassword = input.value;
            if (enteredPassword === content[option].password) {
                currentState = 'authenticated';
                // Small delay to prevent Enter key from triggering return
                setTimeout(() => showContent(option), 100);
            } else {
                showAccessDenied();
            }
        }
    });
}

// Show access denied
function showAccessDenied() {
    terminalElement.innerHTML = '';
    
    const deniedDiv = document.createElement('div');
    deniedDiv.className = 'terminal-line';
    deniedDiv.textContent = 'ACCESS DENIED';
    terminalElement.appendChild(deniedDiv);
    
    addBlankLine();
    
    setTimeout(() => {
        terminalElement.innerHTML = '';
        bootSequenceIndex = 0;
        startBootSequence();
    }, 1500);
}

// Show content
function showContent(option) {
    currentState = 'content';
    const section = content[option];
    
    // Clear terminal
    terminalElement.innerHTML = '';
    
    // Show title
    const titleDiv = document.createElement('div');
    titleDiv.className = 'terminal-line';
    titleDiv.textContent = '=== ' + section.title + ' ===';
    terminalElement.appendChild(titleDiv);
    
    addBlankLine();
    
    // Show content
    const lines = section.text.split('\n');
    lines.forEach(line => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'terminal-line';
        lineDiv.textContent = line;
        terminalElement.appendChild(lineDiv);
    });
    
    addBlankLine();
    addBlankLine();
    
    // Add back option
    const backDiv = document.createElement('div');
    backDiv.className = 'terminal-line clickable';
    backDiv.textContent = '[PRESS ANY KEY TO RETURN]';
    terminalElement.appendChild(backDiv);
    
    // Handle return to menu
    const returnHandler = () => {
        document.removeEventListener('keydown', returnHandler);
        terminalElement.innerHTML = '';
        bootSequenceIndex = 0;
        startBootSequence();
    };
    
    document.addEventListener('keydown', returnHandler);
    backDiv.addEventListener('click', returnHandler);
}
