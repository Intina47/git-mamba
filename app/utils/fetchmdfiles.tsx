export const fetchMdFiles = async (url: string) => {
 try{
  // send a request to different api's accordin to the url entered
  const response = await fetch(url);
  if (response.ok){
   const data = await response.json();
   return data;
  } else {
   throw new Error(`Error fetching markdown files: ${response.statusText}`);
  }
 } catch (error) {
  console.error(error);
  return null;
 }
};