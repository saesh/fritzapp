node default {
   class { 'nodejs':
      version => 'stable',
   }

   package { 'git':
      ensure => 'installed',
   }

   package { 'npm':
      ensure => 'installed',
   }

   package { 'libfontconfig',
      ensure => 'installed',
   }

   package { 'libfontconfig-dev',
      ensure => 'installed',
   }

   package { 'bower':
      provider => npm,
      require  => Class['nodejs'],
   }

   package { 'karma-cli':
      provider => npm,
      require  => Class['nodejs'],
   }

   package { 'gulp':
      provider => npm,
      require  => Class['nodejs'],
   }

   file { "/etc/profile.d/node_path.sh":
      content => "PATH=\$PATH:/usr/local/node/node-default/bin\n",
   }

   file { '/home/vagrant/node_modules':
      ensure  => 'directory',
      owner   => 'vagrant',
      group   => 'vagrant',
   }

   file { '/vagrant/node_modules':
      ensure  => 'link',
      target  => '/home/vagrant/node_modules',
   }
}
