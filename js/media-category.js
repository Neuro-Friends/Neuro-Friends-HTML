jQuery(document).ready(function ($) {
    var taxonomy = mediaCategoryData.taxonomy;
    var terms = mediaCategoryData.terms;

    // Extend the attachment details modal
    wp.media.view.Attachment.Details.TwoColumn.prototype.render = (function (render) {
        return function () {
            render.apply(this, arguments);

            var $taxonomyField = this.$el.find('.media-category-field');

            // Add the taxonomy UI if not already added
            if (!$taxonomyField.length) {
                var $wrapper = $('<div class="media-category-field"><h3>Media Categories</h3></div>');
                var $checkboxList = $('<ul></ul>');

                terms.forEach(function (term) {
                    var $checkbox = $('<input type="checkbox" />')
                        .attr('value', term.id)
                        .attr('id', 'media-category-' + term.id);

                    // Check if term is already assigned
                    if (
                        this.model.attributes.taxonomies &&
                        this.model.attributes.taxonomies[taxonomy] &&
                        this.model.attributes.taxonomies[taxonomy].includes(term.id)
                    ) {
                        $checkbox.prop('checked', true);
                    }

                    var $label = $('<label></label>')
                        .text(term.name)
                        .prepend($checkbox);

                    var $listItem = $('<li></li>').append($label);
                    $checkboxList.append($listItem);
                }.bind(this));

                $wrapper.append($checkboxList);
                this.$el.find('.attachment-info').append($wrapper);
            }
        };
    })(wp.media.view.Attachment.Details.TwoColumn.prototype.render);

    // Save taxonomy terms when the attachment is updated
    wp.media.model.Attachment.prototype.save = (function (save) {
        return function (attrs, options) {
            var $modal = $('.media-category-field');
            var selectedTerms = [];

            $modal.find('input[type="checkbox"]:checked').each(function () {
                selectedTerms.push(parseInt($(this).val(), 10));
            });

            attrs.taxonomies = attrs.taxonomies || {};
            attrs.taxonomies[taxonomy] = selectedTerms;

            return save.apply(this, [attrs, options]);
        };
    })(wp.media.model.Attachment.prototype.save);
});
