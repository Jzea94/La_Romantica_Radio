import { useState, useEffect } from "react";

export const useZenoMetadata = (streamUrl, currentTrack) => {
  const [metadata, setMetadata] = useState({ title: "Salsa Romántica FM", artist: "En Vivo 24/7" });
  const streamId = streamUrl.split('/').pop();

  useEffect(() => {
    // Si estamos reproduciendo un track del Top, usamos su info y no conectamos a Zeno
    if (currentTrack) {
      setMetadata({ title: currentTrack.title, artist: currentTrack.artist });
      return;
    }

    // Reset a info por defecto mientras conecta
    setMetadata({ title: "Salsa Romántica FM", artist: "En Vivo 24/7" });

    const sseUrl = `https://api.zeno.fm/mounts/metadata/subscribe/${streamId}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.streamTitle) {
          const [artist, ...titleParts] = data.streamTitle.split(" - ");
          setMetadata({
            artist: artist?.trim() || "Salsa Romántica",
            title: titleParts.join(" - ")?.trim() || artist?.trim()
          });
        }
      } catch (err) {
        console.error("Error SSE:", err);
      }
    };

    eventSource.onerror = () => eventSource.close();

    return () => eventSource.close();
  }, [streamId, currentTrack]);

  return metadata;
};