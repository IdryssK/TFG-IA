/// <reference lib="webworker" />

function joder(data) {
  return data+'KLK';
} 

addEventListener('message', ({ data }) => {
  console.log('me han llamao')
  const response = {joder: data};
  postMessage(response);
});
self.onerror = function(error) {
  console.error('Error in worker:', error);
};



/*



*/