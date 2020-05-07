var event = {}

export const SubscribeEvent =(name, callback) =>{
    !(name in event) ? event[name] = [callback]:
    event[name].push(callback);
}

export const FireEvent =(name) =>{
    !(name in event) ? console.log('NOTHING TO FIRE') :
    event[name].forEach(element => {
        element()
    });
}

const GetEventTable=()=>{
    return event
}