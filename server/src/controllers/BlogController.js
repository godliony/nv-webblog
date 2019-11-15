const { Blog, Sequelize } = require('../models')
const Op = Sequelize.Op
module.exports = {
  //get all blog
  async index(req, res) {
    try {
      let blogs = null
      const search = req.query.search

      if (search) {
        blogs = await Blog.findAll({
          where: {
            [Op.or]: [
              'title', 'content', 'category'
            ].map(key => ({
              [key]: {
                [Op.like]: `%${search}%`
              }
            }))
          },
          order: [['updatedAt', 'DESC']]
        })
      } else {
        blogs = await Blog.findAll({
          order: [['updatedAt', 'DESC']]
        })

      }
      res.send(blogs)
    } catch (err) {
      res.status(500).send({
        error: 'The blogs information was incorrent'
      })
      console.log(err)
    }
  },
  //create blog
  async create(req, res) {
    try {
      const blog = await Blog.create(req.body)
      res.send(blog.toJSON())
    } catch (err) {
      res.status(500).send({
        error: 'Create blog incorrent'
      })
    }
  },
  //edit blog, suspend, active
  async put(req, res) {
    try {
      await Blog.update(req.body, {
        where: {
          id: req.params.blogId
        }
      })
      res.send(req.body)
    } catch (err) {
      req.status(500).send({
        error: 'Update blog incorrent'
      })
    }
  },
  //delete blog
  async remove(req, res) {
    try {
      console.log(req.params)
      const blog = await Blog.findOne({
        where: {
          id: req.params.blogId
        }
      })
      if (!blog) {
        return res.status(403).send({
          error: 'The blog information was incorrent'
        })
      }

      //console.log(blog.id)
      await blog.destroy()

      res.send(blog)
    } catch (err) {
      req.status(500).send({
        error: "The blog information waw incorrect"
      })
    }
  },
  async show(req, res) {
    try {
      const blog = await Blog.findOne({
        where: {
          id: req.params.blogId
        }
      })
      res.send(blog)
    } catch (err) {
      res.status(500).send({
        error: 'The blog information was incorrent'
      })
    }
  }
}