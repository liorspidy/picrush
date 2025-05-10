export const shortenUrls = async (urls: string[]): Promise<string[]> => {
    const shortened: string[] = [];
  
    for (const url of urls) {
      try {
        const formData = new URLSearchParams();
        formData.append("url", url);
  
        const response = await fetch("https://spoo.me/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
          },
          body: formData.toString(),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        shortened.push(data.short_url);
      } catch (error) {
        console.error("Shorten failed", error);
        shortened.push(url);
      }
    }
  
    return shortened;
  };