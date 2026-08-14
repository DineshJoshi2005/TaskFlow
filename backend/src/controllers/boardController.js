import BoardModel from '../models/boardModel.js';

const BoardController = {
  getBoard(req, res, next) {
    try {
      const boardId = parseInt(req.params.id, 10) || 1;
      const board = BoardModel.getBoardById(boardId);

      if (!board) {
        return res.status(404).json({
          success: false,
          error: `Board with ID ${boardId} not found.`
        });
      }

      res.status(200).json({
        success: true,
        data: board
      });
    } catch (error) {
      next(error);
    }
  },

  getColumnCounts(req, res, next) {
    try {
      const boardId = parseInt(req.params.id, 10) || 1;
      const counts = BoardModel.getTaskCountPerColumn(boardId);

      res.status(200).json({
        success: true,
        data: counts
      });
    } catch (error) {
      next(error);
    }
  }
};

export default BoardController;
