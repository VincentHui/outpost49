var event = {}

export const SubscribeEvent =(name, callback) =>{
    !(name in event) ? event[name] = [callback]:
    event[name].push(callback);
}

export const FireEvent =(name) =>{
    !(name in event) ? console.log('no ' + name + ' to fire') :
    event[name].forEach(element => {
        element()
    });
}

export const ClearEvent =(name) =>{
    !(name in event) ? console.log('NOTHING TO FIRE') :
    delete event[name]
}

// const GetEventTable=()=>{
//     return event
// }