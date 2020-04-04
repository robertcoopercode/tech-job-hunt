import Amplitude from 'amplitude';
import uuid from 'uuid/v4';

const analytics = new Amplitude(process.env.API_AMPLITUDE_API_KEY, { user_id: uuid() });

export default analytics;
