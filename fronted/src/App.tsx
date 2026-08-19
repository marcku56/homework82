import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import AppToolbar from './component/UI/AppToolBar/AppToolBar';
import Artists from './features/artists/Artists';
import Albums from './features/albums/Albums';
import Tracks from './features/tracks/Tracks';

const App = () => {
  return (
      <>
        <AppToolbar />
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={<Artists />} />
            <Route path="/artists/:id" element={<Albums />} />
            <Route path="/albums/:id" element={<Tracks />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </Container>
      </>
  );
};

export default App;