import { useParams } from "react-router-dom";
import tracks from "tracks"; // Assuming you have a tracks data file    
import TrackDetails from "../pages/trackDetails";

const TrackPage = () => {
    const { trackId } = useParams();   // from URL
    const track = tracks[trackId];     // pick ONE track

    return <TrackDetail track={track} />;
};