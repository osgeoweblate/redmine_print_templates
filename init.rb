require_relative 'lib/redmine_print_templates/view_hooks'

Redmine::Plugin.register :redmine_print_templates do
  name 'Redmine Print Templates plugin'
  author 'Georepublic'
  author_url 'https://github.com/georepublic'
  url 'https://github.com/gtt-project/redmine_print_templates'
  description 'Enables printing templates with PDFme in Redmine deployments'
  version '0.4.0'

  requires_redmine :version_or_higher => '6.0.0'

  settings(
    default: {
      'default_placeholder_empty' => '',
      'default_pdf_author' => ENV['PDF_AUTHOR'] || 'Redmine System',
      'default_pdf_creator' => ENV['PDF_CREATOR'] || 'Redmine Print Plugin, powered by PDFme',
      'default_pdf_producer' => ENV['PDF_PRODUCER'] || 'Redmine Print Plugin',
      'default_pdf_basemap' => ''
    },
    partial: 'print_templates/settings'
  )

  project_module :print_templates do
    permission :view_print_templates, {}, :require => :loggedin
    permission :edit_print_templates, {}, :require => :member
    permission :admin_print_templates, {}, :require => :member
  end

  menu :admin_menu, :print_templates, { controller: 'print_templates', action: 'index' },
    caption: :label_print_templates_plural,
    html: { class: 'icon icon-print-templates' },
    :icon => 'print-templates', :plugin => :redmine_print_templates
end
