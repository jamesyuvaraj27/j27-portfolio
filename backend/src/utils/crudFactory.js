// Generic CRUD controller factory shared across all simple content models
// (Service, Skill, Education, Experience, Testimonial, ...).
// Models with file uploads or extra logic (Project, Certification, Photo,
// BlogPost, PricingPlan) use their own controller but still share these
// validation/util helpers from validation.js.

export const buildCrudController = ({ model, buildPayload, orderBy = { createdAt: "desc" } }) => ({
  list: async (req, res, next) => {
    try {
      const items = await model.findMany({ orderBy });
      res.json(items);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const data = buildPayload(req.body);
      const item = await model.create({ data });
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const data = buildPayload(req.body);
      const item = await model.update({ where: { id: req.params.id }, data });
      res.json(item);
    } catch (error) {
      next(error);
    }
  },

  remove: async (req, res, next) => {
    try {
      await model.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
});
