import { useEffect, useState } from 'react';
import Alert from '../components/ui/Alert';

const Visualization = ({ path, setGrid, start, end }) => {
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    if (path.length > 0) {
      setGrid(prev => {
        const newGrid = prev.map(row => [...row]);
        for (let r = 0; r < newGrid.length; r++) {
          for (let c = 0; c < newGrid[0].length; c++) {
            if (newGrid[r][c] === 3) newGrid[r][c] = 0;
          }
        }
        return newGrid;
      });

      path.forEach(([r, c], index) => {
        setTimeout(() => {
          setGrid(prev => {
            const newGrid = prev.map(row => [...row]);
            if (newGrid[r][c] !== 2 && newGrid[r][c] !== 1) {
              newGrid[r][c] = 3;
            }
            return newGrid;
          });
        }, index * 100);
      });
    } else if (path.length === 0 && start !== null && end !== null) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, setGrid]);

  return (
    <>
      <Alert message='⚠️ No optimal path could be found!' isVisible={showAlert} />
    </>
  );
};

export default Visualization;
