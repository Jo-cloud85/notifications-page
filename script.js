const nBoxes = document.querySelector('.notifications');
const marBtn = document.querySelector('#mar-btn');
const header = document.querySelector('header');
const nNum = document.querySelector('.n-num'); 

async function loadNotification() {
    nBoxes.innerHTML = "";
    let response = await fetch('notifications.json');
    let notifications = await response.json();

    let numOfUnreadN = 0 //to count all the unread notifications later
    
    const redDots = []; //create an array to store all redDot elements

    for (let i=notifications.length-1; i>=0; i--) {

        //extract the respective info from json file
        const nameA = notifications[i].name;
        const lcName = nameA.toLowerCase();
        const activityRA = notifications[i].activity.reaction;
        const activityDA = notifications[i].activity.description;
        const status = notifications[i].status;
        const timeAgo = notifications[i].time;
        
        //create a div called nBox for each notification
        const nBox = document.createElement('div'); //This is for each nBox
        
        //create elements within each nBox div
        const profileImg = document.createElement('img'); //this is for their profile pic in each nBox
        const info = document.createElement('div'); //this is for all the info in each nBox
        
        //add class to nBox div
        nBox.classList.add('nBox'); //nBox css will create the box first

        //img (sub-div of nBox-div)
        profileImg.src = `./assets/images/avatar-${lcName.replace(/\s+/g, '-')}.webp`;
        profileImg.alt = `${lcName.replace(/\s+/g, '-')}-avatar`;

        //add class to info (sub-div of nBox-div)
        info.classList.add('info');

        //create elements within info div
        const activity = document.createElement('div');
        const time = document.createElement('p');

        //add classes to activity, time div (sub-divs of info)
        activity.classList.add('activity');
        time.classList.add('time');
        
        //create element(s) & add classes within activity div
        const name = document.createElement('a');
        name.href='#'
        const activityR = document.createElement('span');
        const activityD = document.createElement('a');
        activityD.href='#'
        
        //add classes & set text to name, activityR (sub-divs of activity div), classes for activityD to add later due to special conditions
        name.classList.add('name');
        name.textContent = nameA;

        activityR.classList.add('activity-r');
        activityR.textContent = activityRA;
        
        //set text to time div
        time.textContent = timeAgo;

        //joining parts of divs within activity div & using if else to check condition
        let lastWord = activityRA.split(" ").pop();
        
        activityD.textContent = activityDA;
        
        //append first as the sequence of elements or divs appended matters
        activity.appendChild(name);
        activity.appendChild(activityR);
        activity.appendChild(activityD);

        info.appendChild(activity);
        info.appendChild(time);

        if (lastWord === 'post') {
            activityD.classList.add('activity-d-gray');
        } else if (lastWord === 'group') {
            activityD.classList.add('activity-d-blue');
        } else if (lastWord === 'message') {
            //create an extra div and add class (extra sub-div of info)
            const privateMsg = document.createElement('div');
            privateMsg.classList.add('privateMsg');
            //create element & add class within privateMsg div
            const privateM = document.createElement('p');
            privateM.classList.add('privateMsg-text');
            activityD.textContent = '';
            privateM.textContent = activityDA;
            privateMsg.appendChild(privateM);
            info.appendChild(privateMsg);
        }

        if (status === "read") {
            nBox.classList.add('nBox-transparent-bg') //light blue box is just the default bg color if unread
        } else {
            const redDot = document.createElement('span');
            redDot.classList.add('red-dot');
            activity.appendChild(redDot);
            numOfUnreadN++; //to count all the unread notifications that is to be shown on the page
            redDots.push(redDot); //push new elements into the redDots array
        }

        //append first as the sequence of elements or divs appended matters
        nBox.appendChild(profileImg);
        nBox.appendChild(info);

        if (lastWord === 'picture') {
            activityD.textContent = '';
            const pic = document.createElement('img');
            pic.classList.add('pic-img');
            pic.src = activityDA;
            pic.alt = "pic-img";
            nBox.appendChild(pic);
            nBox.classList.remove('nBox');
            nBox.classList.add('nBox-v2'); //for reformating to add 1 more column for the pic
        }

        nBoxes.appendChild(nBox);
    }

    nNum.textContent = numOfUnreadN //this line has to be out of the for loop

    //mark-all-as-read button which serves as a toggle
    marBtn.addEventListener('click',() => {
        
        nNum.classList.toggle('n-num');
        nNum.classList.toggle('n-num-toggle');

        nBoxes.querySelectorAll('.nBox').forEach((nBox, i) => {
            nBox.classList.toggle('nBox-transparent-bg-toggle');
            if (redDots[i]) {
                redDots[i].classList.toggle('red-dot');
            }
        });
    });
}

loadNotification();