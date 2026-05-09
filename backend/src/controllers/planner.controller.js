const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apiError');
const plannerService = require('../services/ai/plannerService');

/**
 * POST /api/planner/generate
 * Body:
 * {
 *   goals: string,
 *   timezone?: string
 * }
 */
const generatePlan = asyncHandler(async (req, res) => {
  const { goals, timezone } = req.body || {};
  const userId = req.user.uid;

  if (!goals || typeof goals !== 'string' || !goals.trim()) {
    throw new ApiError(400, 'Missing required field: goals');
  }

  const result = await plannerService.generateDailyPlan({ userId, goals, timezone });

  res.json({ plan: result });
});

module.exports = { generatePlan };

