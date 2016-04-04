function truncate(node){
  var location = ''
  if(node.mark.substr(0,1) == 'P'){
    location = node.mark.substr(1,2);
  } else {
    location = node.mark.substr(1,1);
  }
  return {
    type: node.mark.substr(0,1),
    title: node.name, 
    description: node.description, 
    time: node.start, 
    key: node.mark, 
    location: location, 
    slot: node.mark.substr(node.mark.length - 4, 4)
  };
}