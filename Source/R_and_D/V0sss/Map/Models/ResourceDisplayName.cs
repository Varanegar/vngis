namespace TrackingMap.Models
{
    public class ResourceDisplayName: System.ComponentModel.DisplayNameAttribute
    {
        private string _resourceValue = string.Empty;
        //private bool _resourceValueRetrived;

        public ResourceDisplayName(string resourceKey)
            : base(resourceKey)
        {
            ResourceKey = resourceKey;
        }

        public string ResourceKey { get; set; }

        public override string DisplayName
        {
            get
            {
                _resourceValue = CaptionResource.ResourceManager.GetString(ResourceKey);
                        
                return _resourceValue;
            }
        }

        public string Name
        {
            get { return "ResourceDisplayName"; }
        }
    }
    
}