class Category {
  constructor(id, name, description, maximumAmount, type) {
    this.id = id;
    this.name = name;
    this.description = description || "";
    this.maximumAmount = maximumAmount || 0;
    this.type = type;
  }
}
export default Category;
