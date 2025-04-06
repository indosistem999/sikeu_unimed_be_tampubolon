export const menuSchema: {
  tableName: string,
  primaryKey: string,
} = {
  tableName: 'master_menu',
  primaryKey: 'menu_id'
}

export const sortRequest: Record<string, any> = {
  name: 'name',
  slug: 'slug',
  order_number: 'order_number'
};

export const sortDefault: string[] = [`order_number`, 'asc'];

export const selectDetailMenu: Record<string, any> = {
  menu_id: true,
  name: true,
  slug: true,
  parent: {
    menu_id: true,
    name: true,
    slug: true,
    parent: {
      menu_id: true,
      name: true,
      slug: true,
      created_at: true,
      created_by: true
    },
    children: {
      menu_id: true,
      name: true,
      slug: true,
      created_at: true,
      created_by: true
    },
    created_at: true,
    created_by: true
  },
  children: {
    menu_id: true,
    name: true,
    slug: true,
    parent: {
      menu_id: true,
      name: true,
      slug: true,
      created_at: true,
      created_by: true
    },
    children: {
      menu_id: true,
      name: true,
      slug: true,
      created_at: true,
      created_by: true
    },
    created_at: true,
    created_by: true
  },
  master_module: {
    module_id: true,
    module_name: true,
    module_path: true
  },
  created_at: true,
  updated_at: true
}